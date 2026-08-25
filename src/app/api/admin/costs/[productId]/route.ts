import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ productId: string }>;

type MaterialPayload = {
  name?: unknown;
  unit?: unknown;
  quantity?: unknown;
  unitPrice?: unknown;
};

const toNumber = (value: unknown) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const serializeCost = (
  productId: string,
  cost: {
    marginPercent: { toNumber: () => number } | number;
    materials: Array<{
      id: string;
      name: string;
      unit: string;
      quantity: { toNumber: () => number } | number;
      unitPrice: { toNumber: () => number } | number;
    }>;
  } | null,
) => ({
  productId,
  marginPercent:
    typeof cost?.marginPercent === "number"
      ? cost.marginPercent
      : cost?.marginPercent.toNumber() ?? 0,
  materials:
    cost?.materials.map((material) => {
      const quantity =
        typeof material.quantity === "number" ? material.quantity : material.quantity.toNumber();
      const unitPrice =
        typeof material.unitPrice === "number" ? material.unitPrice : material.unitPrice.toNumber();

      return {
        id: material.id,
        name: material.name,
        unit: material.unit,
        quantity,
        unitPrice,
        subtotal: quantity * unitPrice,
      };
    }) ?? [],
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user?.role === "ADMIN");
}

function productExists(productId: string) {
  return products.some((product) => product.id === productId);
}

export async function GET(_request: Request, context: { params: Params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { productId } = await context.params;

  if (!productExists(productId)) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const cost = await prisma.productCost.findUnique({
    where: { productId },
    include: { materials: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(serializeCost(productId, cost));
}

export async function PUT(request: Request, context: { params: Params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { productId } = await context.params;

  if (!productExists(productId)) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const body = (await request.json()) as {
    marginPercent?: unknown;
    materials?: MaterialPayload[];
  };

  const marginPercent = Math.max(0, toNumber(body.marginPercent));
  const materials = Array.isArray(body.materials) ? body.materials : [];

  const sanitizedMaterials = materials
    .map((material, index) => ({
      name: typeof material.name === "string" ? material.name.trim() : "",
      unit: typeof material.unit === "string" ? material.unit.trim() : "",
      quantity: Math.max(0, toNumber(material.quantity)),
      unitPrice: Math.max(0, toNumber(material.unitPrice)),
      sortOrder: index,
    }))
    .filter((material) => material.name || material.unit || material.quantity || material.unitPrice);

  const cost = await prisma.$transaction(async (tx) => {
    const productCost = await tx.productCost.upsert({
      where: { productId },
      update: { marginPercent },
      create: { productId, marginPercent },
    });

    await tx.costMaterial.deleteMany({
      where: { productCostId: productCost.id },
    });

    if (sanitizedMaterials.length) {
      await tx.costMaterial.createMany({
        data: sanitizedMaterials.map((material) => ({
          productCostId: productCost.id,
          ...material,
        })),
      });
    }

    return tx.productCost.findUnique({
      where: { productId },
      include: { materials: { orderBy: { sortOrder: "asc" } } },
    });
  });

  return NextResponse.json(serializeCost(productId, cost));
}
