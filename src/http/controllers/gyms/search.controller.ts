import { makeSearchGymsUsecase } from '@/usecases/factories/make-search-gyms-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })
  const { page, query } = searchGymsQuerySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUsecase()

  const { gyms } = await searchGymsUseCase.execute({
    page,
    query,
  })

  return reply.code(200).send(gyms)
}
