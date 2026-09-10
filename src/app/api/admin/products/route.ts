import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ProductPayload = {
  name?: unknown;
  category?: unknown;
  subcategory?: unknown;
  collection?: unknown;
  description?: unknown;
  details?: unknown;
  features?: unknown;
  material?: unknown;
  dimensions?: unknown;
  price?: unknown;
  pixPrice?: unknown;
  images?: unknown;
};

const MAX_IMAGES = 12;
const MAX_IMAGE_BYTES = 1_800_000;

const toText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const toOptionalText = (value: unknown) => {
  const text = toText(value);
  return text || null;
};

const toNumberOrNull = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(",", "."))
        : Number.NaN;

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const toTextList = (value: unknown) =>
  Array.isArray(value)
    ? value.map(toText).filter(Boolean)
    : toText(value)
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

const parseImage = (value: unknown) => {
  if (typeof value !== "string") return null;

  const match = value.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;

  const mimeType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
  const bytes = Buffer.from(match[2], "base64");
  const arrayBuffer = new ArrayBuffer(bytes.byteLength);
  const data = new Uint8Array(arrayBuffer);
  data.set(bytes);

  if (!data.length || data.byteLength > MAX_IMAGE_BYTES) return null;

  return { mimeType, data };
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user?.role === "ADMIN");
}

const serializeProduct = (product: {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  collection: string | null;
  description: string | null;
  details: string[];
  features: string[];
  material: string | null;
  dimensions: string | null;
  price: { toNumber: () => number } | number | null;
  pixPrice: { toNumber: () => number } | number | null;
  images: Array<{ id: string }>;
}) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  subcategory: product.subcategory ?? undefined,
  collection: product.collection ?? undefined,
  description: product.description ?? undefined,
  details: product.details,
  features: product.features,
  material: product.material ?? undefined,
  dimensions: product.dimensions ?? undefined,
  price:
    product.price === null
      ? undefined
      : typeof product.price === "number"
        ? product.price
        : product.price.toNumber(),
  pixPrice:
    product.pixPrice === null
      ? undefined
      : typeof product.pixPrice === "number"
        ? product.pixPrice
        : product.pixPrice.toNumber(),
  images: product.images.map((image) => `/api/product-images/${image.id}`),
});

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as ProductPayload;
  const name = toText(body.name);
  const category = toText(body.category) || "Bolsas";
  const rawImages = Array.isArray(body.images) ? body.images.slice(0, MAX_IMAGES) : [];
  const images = rawImages.map(parseImage).filter(Boolean) as Array<{
    mimeType: string;
    data: Uint8Array<ArrayBuffer>;
  }>;

  if (!name) {
    return NextResponse.json({ error: "Informe o nome do produto." }, { status: 400 });
  }

  if (!images.length) {
    return NextResponse.json({ error: "Envie pelo menos uma foto do produto." }, { status: 400 });
  }

  if (rawImages.length !== images.length) {
    return NextResponse.json(
      { error: "Uma ou mais fotos estão em formato inválido ou grandes demais." },
      { status: 400 },
    );
  }

  const lastProduct = await prisma.catalogProduct.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const product = await prisma.$transaction(async (tx) => {
    const created = await tx.catalogProduct.create({
      data: {
        name,
        category,
        subcategory: toOptionalText(body.subcategory),
        collection: toOptionalText(body.collection),
        description: toOptionalText(body.description),
        details: toTextList(body.details),
        features: toTextList(body.features),
        material: toOptionalText(body.material),
        dimensions: toOptionalText(body.dimensions),
        price: toNumberOrNull(body.price),
        pixPrice: toNumberOrNull(body.pixPrice),
        sortOrder: (lastProduct?.sortOrder ?? 0) + 1,
      },
    });

    await tx.catalogProductImage.createMany({
      data: images.map((image, index) => ({
        productId: created.id,
        mimeType: image.mimeType,
        data: image.data,
        sortOrder: index,
      })),
    });

    return tx.catalogProduct.findUniqueOrThrow({
      where: { id: created.id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          select: { id: true },
        },
      },
    });
  });

  return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
}
