import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckinsRepository
let gymRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check-in UseCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinsRepository()
    gymRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInsRepository, gymRepository)

    vi.useFakeTimers({})

    gymRepository.items.push({
      description: 'academia justin',
      id: 'gym-01',
      title: 'Academia Forte',
      latitude: new Decimal(-22.8360352),
      longitude: new Decimal(-47.202852),
      phone: '',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.8360352,
      userLongitude: -47.202852,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.8360352,
      userLongitude: -47.202852,
    })

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.8360352,
        userLongitude: -47.202852,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.8360352,
      userLongitude: -47.202852,
    })

    vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.8360352,
        userLongitude: -47.202852,
      }),
    ).resolves.toBeTruthy()
  })

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    gymRepository.items.push({
      description: 'academia justin',
      id: 'gym-02',
      title: 'Academia Forte',
      latitude: new Decimal(-23.8360332),
      longitude: new Decimal(-48.202852),
      phone: '',
    })

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.7724397,
        userLongitude: -47.1576746,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
