import { makeFetchNearByGymsUsecase } from '@/usecases/factories/make-fetch-near-by-gyms-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })
  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const fetchNearByGymsUseCase = makeFetchNearByGymsUsecase()

  const { gyms } = await fetchNearByGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.code(200).send(gyms)
}
