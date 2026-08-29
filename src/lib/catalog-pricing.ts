import { products, type Product } from "@/data/products";
import { prisma } from "@/lib/prisma";

const toNumber = (value: { toNumber: () => number } | number) =>
  typeof value === "number" ? value : value.toNumber();

export async function getCatalogProducts(): Promise<Product[]> {
  try {
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

    return products.map((product) => ({
      ...product,
      ...(pricesByProductId.get(product.id) ?? {}),
    }));
  } catch (error) {
    console.error("Erro ao carregar preços do catálogo pelo custo de produção.", error);
    return products;
  }
}
