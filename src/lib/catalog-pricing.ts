import { products, type Product } from "@/data/products";
import { prisma } from "@/lib/prisma";

const toNumber = (value: { toNumber: () => number } | number) =>
  typeof value === "number" ? value : value.toNumber();

type DbProduct = {
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
};

const fromDbProduct = (product: DbProduct): Product => ({
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
  price: product.price === null ? undefined : toNumber(product.price),
  pixPrice: product.pixPrice === null ? undefined : toNumber(product.pixPrice),
  images: product.images.map((image) => `/api/product-images/${image.id}`),
  editable: true,
});

async function getDatabaseProducts() {
  const dbProducts = await prisma.catalogProduct.findMany({
    where: { active: true },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return dbProducts.map(fromDbProduct).filter((product) => product.images.length > 0);
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const databaseProducts = await getDatabaseProducts();
    return [...products, ...databaseProducts];
  } catch (error) {
    console.error("Erro ao carregar produtos cadastrados no banco.", error);
    return products;
  }
}

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();
    const costs = await prisma.productCost.findMany({
      include: {
        materials: true,
      },
    });

    const pricesByProductId = new Map<string, Pick<Product, "price" | "pixPrice">>();

    for (const cost of costs) {
      const materialTotal = cost.materials.reduce(
        (total, material) => total + toNumber(material.quantity) * toNumber(material.unitPrice),
        0,
      );

      if (materialTotal <= 0) continue;

      const marginPercent = toNumber(cost.marginPercent);
      const machinePercent = toNumber(cost.machinePercent);
      const pixPrice = materialTotal + materialTotal * (marginPercent / 100);
      const cardPrice = pixPrice + pixPrice * (machinePercent / 100);

      if (pixPrice > 0 && cardPrice > 0) {
        pricesByProductId.set(cost.productId, {
          price: Math.round(cardPrice),
          pixPrice: Math.round(pixPrice),
        });
      }
    }

    return allProducts.map((product) => ({
      ...product,
      ...(pricesByProductId.get(product.id) ?? {}),
    }));
  } catch (error) {
    console.error("Erro ao carregar preços do catálogo pelo custo de produção.", error);
    return products;
  }
}
