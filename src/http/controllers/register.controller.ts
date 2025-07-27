import { UserAlreadyExistsError } from '@/usecases/errors/user-already-exists.error'
import { makeRegisterUsecase } from '@/usecases/factories/make-register-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUsecase()

    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.code(409).send({ message: error.message })
    }
    throw error
  }

  return reply.code(201).send({ message: 'Usuario criado com sucesso' })
}
