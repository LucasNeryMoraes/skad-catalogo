CREATE TABLE "CatalogProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "collection" TEXT,
    "description" TEXT,
    "details" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "material" TEXT,
    "dimensions" TEXT,
    "price" DECIMAL(12, 2),
    "pixPrice" DECIMAL(12, 2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogProduct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CatalogProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatalogProductImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CatalogProduct_active_sortOrder_idx" ON "CatalogProduct"("active", "sortOrder");
CREATE INDEX "CatalogProduct_category_subcategory_idx" ON "CatalogProduct"("category", "subcategory");
CREATE INDEX "CatalogProductImage_productId_sortOrder_idx" ON "CatalogProductImage"("productId", "sortOrder");

ALTER TABLE "CatalogProductImage" ADD CONSTRAINT "CatalogProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CatalogProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
