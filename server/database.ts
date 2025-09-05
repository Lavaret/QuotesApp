import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Important for serverless environments
  errorFormat: 'minimal',
  // Reduce connection pool size for serverless
  ...(process.env.NODE_ENV === 'production' && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL + '?pgbouncer=true&connection_limit=1',
      },
    },
  }),
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Gracefully disconnect on process termination (important for serverless)
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma
