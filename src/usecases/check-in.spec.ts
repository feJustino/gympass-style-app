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
      latitude: new Decimal(0),
      longitude: new Decimal(0),
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
      userLatitude: 0,
      userLongitude: 0,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).resolves.toBeTruthy()
  })
})
