import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis;

// Initialize the Postgres Adapter using your connection pool URL
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});

// Pass the adapter into the PrismaClient constructor
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
