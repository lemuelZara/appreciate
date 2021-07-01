import { prisma } from '~shared/infra/database/prisma/client';

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}
