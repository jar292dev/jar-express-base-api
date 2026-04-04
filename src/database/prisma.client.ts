import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const { DB_TYPE, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const url = `${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
