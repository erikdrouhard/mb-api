/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_belongsToId_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "LICENSE_STATUS";

-- DropEnum
DROP TYPE "ROLE";

-- CreateTable
CREATE TABLE "DBUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "DBUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "licenseDuration" INTEGER NOT NULL DEFAULT 2,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resellerId" TEXT NOT NULL,
    "pledgeAmount" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DBUser_username_key" ON "DBUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_resellerId_key" ON "Customer"("resellerId");
