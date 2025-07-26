import { registerUseCase } from '@/usecases/register.usecase'
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
    await registerUseCase({ name, email, password })
  } catch (error) {
    return reply.code(409).send({ message: 'Email já cadastrado' })
  }

  return reply.code(201).send({ message: 'Usuario criado com sucesso' })
}
