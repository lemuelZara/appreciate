import { prisma } from '~shared/infra/database/prisma/client';

export function getPrismaClient() {
  return prisma;
}
