import { PrismaClient } from '@prisma/client'

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Ustaw DATABASE_URL');
    }
    throw new Error('Ustaw DATABASE_URL');
  }
  return url;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
})

// Ustaw timeout dla zapytań
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper do zapytań z timeoutem
export async function prismaWithTimeout<T>(
  operation: (client: PrismaClient) => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return Promise.race([
    operation(prisma),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timeout')), timeoutMs)
    ),
  ])
}