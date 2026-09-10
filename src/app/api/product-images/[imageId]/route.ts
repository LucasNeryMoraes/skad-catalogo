import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ imageId: string }>;

export async function GET(_request: Request, context: { params: Params }) {
  const { imageId } = await context.params;

  const image = await prisma.catalogProductImage.findUnique({
    where: { id: imageId },
    select: {
      mimeType: true,
      data: true,
      product: {
        select: { active: true },
      },
    },
  });

  if (!image || !image.product.active) {
    return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  }

  return new NextResponse(image.data, {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
