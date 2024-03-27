import { PrismaClient } from '@prisma/client';

// gives us one place to import the PrismaClient
const prisma = new PrismaClient();

export default prisma;
