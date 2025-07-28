import { Gym } from '@/generated/prisma'
import { GymRepository } from '@/repositories/gyms.repository'

interface FetchNearByGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearByGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearByGymsUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByGymsUseCaseRequest): Promise<FetchNearByGymsUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
