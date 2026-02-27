import { PrismaClient } from '@prisma/client'

const g = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    g.prisma ??
    new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL || "file:./dev.db"
    })

if (process.env.NODE_ENV !== 'production') g.prisma = prisma
