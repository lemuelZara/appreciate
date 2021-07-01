import { prisma } from '~shared/infra/database/prisma/client';

export async function resetDB(): Promise<void> {
  const tables =
    await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  /* eslint no-restricted-syntax: ["error", "ForInStatement"] */
  for await (const { tablename } of tables) {
    try {
      if (tablename !== '_prisma_migrations') {
        await prisma.$queryRaw(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
