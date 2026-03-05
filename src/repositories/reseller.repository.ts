import prisma from '../db';
import { Prisma } from '@prisma/client';

export const resellerRepository = {
  findAll() {
    return prisma.reseller.findMany();
  },

  findByResellerId(resellerId: string) {
    return prisma.reseller.findFirst({ where: { resellerId } });
  },

  create(data: Prisma.ResellerCreateInput) {
    return prisma.reseller.create({ data });
  },

  update(id: string, data: Prisma.ResellerUpdateInput) {
    return prisma.reseller.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.reseller.delete({ where: { id } });
  },
};
