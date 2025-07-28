import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckinsRepository
let sut: GetUserMetricsUseCase
describe('Get Users Metrics UseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get metrics check-in user', async () => {
    for (let i = 1; i <= 6; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    for (let i = 1; i <= 5; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-02',
      })
    }

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })
    expect(checkInsCount).toEqual(6)
  })
})
