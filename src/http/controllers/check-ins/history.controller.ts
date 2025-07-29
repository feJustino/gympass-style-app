import { makeFetchUserCheckInsHistoryUseCase } from '@/usecases/factories/make-fetch-user-check-ins-history-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkinHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })
  const { page } = checkinHistoryQuerySchema.parse(request.query)

  const fetchUserCheckinsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckinsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.code(200).send(checkIns)
}
