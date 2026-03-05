import { Prisma } from '@prisma/client';
import { resellerRepository } from '../repositories/reseller.repository';
import { NotFoundError } from '../modules/errors';

export const resellerService = {
  async getAll() {
    return resellerRepository.findAll();
  },

  async getOne(resellerId: string) {
    const reseller = await resellerRepository.findByResellerId(resellerId);
    if (!reseller) {
      throw new NotFoundError('Reseller not found');
    }
    return reseller;
  },

  async create(data: Prisma.ResellerCreateInput) {
    return resellerRepository.create(data);
  },

  async update(id: string, data: Prisma.ResellerUpdateInput) {
    return resellerRepository.update(id, data);
  },

  async remove(id: string) {
    return resellerRepository.delete(id);
  },
};
