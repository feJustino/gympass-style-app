import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'

interface CreateAndAuthenticateUserResponse {
  token: string
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
): Promise<CreateAndAuthenticateUserResponse> {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await app.inject({
    method: 'POST',
    url: '/sessions',
    payload: {
      email: 'john@example.com',
      password: '123456',
    },
  })

  const { token } = authResponse.json()

  return { token }
}
