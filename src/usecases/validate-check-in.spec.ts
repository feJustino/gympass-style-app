import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

let checkInsRepository: InMemoryCheckinsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in UseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers({})
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check in', async () => {
    const createdCheckin = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({ checkinId: createdCheckin.id })
    expect(checkIn.validate_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validate_at).toEqual(expect.any(Date))
  })

  it('should be not able to validate inexistent check in', async () => {
    await expect(
      sut.execute({ checkinId: 'unexistent-checkin-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be not able to validate the check-in after pass 20 minutes', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))
    const createdCheckin = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)
    await expect(
      sut.execute({ checkinId: createdCheckin.id }),
    ).rejects.toBeInstanceOf(Error)
  })
})
