import { makeGetUserProfileUsecase } from '@/usecases/factories/make-get-user-profile-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUsecase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.code(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
