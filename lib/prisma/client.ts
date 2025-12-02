import { PrismaClient } from "@prisma/client";

// Use a build-time safe Prisma client
const prisma = (globalThis as any).prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;

export { prisma };
export default prisma;
