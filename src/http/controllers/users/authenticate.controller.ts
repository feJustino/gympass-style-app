import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user.repository'
import { AuthenticateUseCase } from '@/usecases/authenticate'
import { InvalidCredentialsError } from '@/usecases/errors/invalid-credentials.error'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const authUsecase = new AuthenticateUseCase(usersRepository)

    const { user } = await authUsecase.execute({ email, password })

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: { sub: user.id },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.code(400).send({ message: error.message })
    }
    throw error
  }
}
