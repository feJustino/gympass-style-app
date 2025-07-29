import { makeCheckInUseCase } from '@/usecases/factories/make-check-in-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckinParamsSchema = z.object({
    gymId: z.string(),
  })

  const createCheckinBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckinBodySchema.parse(request.body)
  const { gymId } = createCheckinParamsSchema.parse(request.params)

  const createCheckInUseCase = makeCheckInUseCase()

  const checkIn = await createCheckInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.code(201).send(checkIn)
}
