import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import type { Environment } from 'vitest/environments'
import { execSync } from 'node:child_process'
import { prisma } from '@/lib/prisma'

function generateDatabaseURL(schmema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schmema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // Criar banco de testes

    const schmema = randomUUID()
    const databaseUrl = generateDatabaseURL(schmema)

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // Apagar banco de testes

        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schmema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
