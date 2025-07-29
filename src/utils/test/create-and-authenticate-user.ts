import { FastifyInstance } from 'fastify'

interface CreateAndAuthenticateUserResponse {
  token: string
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
): Promise<CreateAndAuthenticateUserResponse> {
  await app.inject({
    method: 'POST',
    url: '/users',
    payload: {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
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
