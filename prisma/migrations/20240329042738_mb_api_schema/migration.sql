/*
  Warnings:

  - The `licenseDuration` column on the `Reseller` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backerNumber` column on the `Reseller` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reseller" DROP COLUMN "licenseDuration",
ADD COLUMN     "licenseDuration" INTEGER NOT NULL DEFAULT 2,
DROP COLUMN "backerNumber",
ADD COLUMN     "backerNumber" INTEGER;
