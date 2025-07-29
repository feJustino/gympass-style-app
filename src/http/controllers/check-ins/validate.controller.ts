import { makeValidateCheckInUseCase } from '@/usecases/factories/make-validate-check-in-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckinParamschema = z.object({
    checkinId: z.uuid(),
  })
  const { checkinId } = validateCheckinParamschema.parse(request.params)

  const validateCheckinUseCase = makeValidateCheckInUseCase()

  await validateCheckinUseCase.execute({
    checkinId,
  })

  return reply.code(204).send()
}
