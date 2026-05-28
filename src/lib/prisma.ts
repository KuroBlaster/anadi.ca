import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrisma() {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  return globalForPrisma.prisma;
}
