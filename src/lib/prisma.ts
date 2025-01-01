import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent variable redeclaration in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // Log database queries (optional)
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma; // Cache the PrismaClient instance in development
}

export { prisma };
