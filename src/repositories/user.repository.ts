import prisma from '../db';

export const userRepository = {
  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  create(data: { username: string; password: string }) {
    return prisma.user.create({ data });
  },
};
