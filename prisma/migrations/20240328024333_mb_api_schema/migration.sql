/*
  Warnings:

  - You are about to drop the `DBUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DBUser";

-- CreateTable
CREATE TABLE "DbUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "DbUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DbUser_username_key" ON "DbUser"("username");
