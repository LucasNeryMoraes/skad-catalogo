CREATE TABLE "ProductCost" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "marginPercent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CostMaterial" (
    "id" TEXT NOT NULL,
    "productCostId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostMaterial_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductCost_productId_key" ON "ProductCost"("productId");
CREATE INDEX "CostMaterial_productCostId_sortOrder_idx" ON "CostMaterial"("productCostId", "sortOrder");

ALTER TABLE "CostMaterial" ADD CONSTRAINT "CostMaterial_productCostId_fkey" FOREIGN KEY ("productCostId") REFERENCES "ProductCost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
