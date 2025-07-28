import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { FetchNearByGymsUseCase } from '../fetch-near-by-gyms'

export function makeFetchNearByGymsUsecase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearByGymsUseCase(gymsRepository)

  return useCase
}
