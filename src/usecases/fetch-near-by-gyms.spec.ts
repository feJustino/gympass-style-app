import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearByGymsUseCase } from './fetch-near-by-gyms'

let gymRepository: InMemoryGymRepository
let sut: FetchNearByGymsUseCase
describe('Fetch Users Check-in History UseCase', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    sut = new FetchNearByGymsUseCase(gymRepository)
  })

  it('should be able to fetch near by gyms', async () => {
    await gymRepository.create({
      title: 'Near Gym',
      description: 'Academia com pesos',
      phone: '19 99999-9999',
      latitude: -22.8360352,
      longitude: -47.202852,
    })
    await gymRepository.create({
      title: 'FarGym',
      description: 'Academia com luta',
      phone: '19 99999-9999',
      latitude: -22.9137295,
      longitude: -43.6107893,
    })
    const { gyms } = await sut.execute({
      userLatitude: -22.8360352,
      userLongitude: -47.202852,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
