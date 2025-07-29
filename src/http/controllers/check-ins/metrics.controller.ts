import { makeGetUserMetricsUsecase } from '@/usecases/factories/make-get-user-metrics-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const fetchUserCheckinsHistoryUseCase = makeGetUserMetricsUsecase()

  const { checkInsCount } = await fetchUserCheckinsHistoryUseCase.execute({
    userId: request.user.sub,
  })

  return reply.code(200).send(checkInsCount)
}
