/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DbUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "DbUser";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reseller" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "backerId" TEXT NOT NULL,
    "licenseDuration" TEXT NOT NULL DEFAULT '2',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resellerId" TEXT NOT NULL,
    "pledgeAmount" TEXT,
    "backerNumber" TEXT,

    CONSTRAINT "Reseller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Reseller_backerId_key" ON "Reseller"("backerId");

-- CreateIndex
CREATE UNIQUE INDEX "Reseller_email_key" ON "Reseller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reseller_resellerId_key" ON "Reseller"("resellerId");
