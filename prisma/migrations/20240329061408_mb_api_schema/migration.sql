/*
  Warnings:

  - A unique constraint covering the columns `[backerNumber]` on the table `Reseller` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reseller" ALTER COLUMN "backerId" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reseller_backerNumber_key" ON "Reseller"("backerNumber");
