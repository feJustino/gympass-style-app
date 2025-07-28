import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymUseCase } from './search-gyms'

let gymRepository: InMemoryGymRepository
let sut: SearchGymUseCase
describe('Fetch Users Check-in History UseCase', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    sut = new SearchGymUseCase(gymRepository)
  })

  it('should be able to search gym', async () => {
    await gymRepository.create({
      title: 'Academia Node',
      description: 'Academia com pesos',
      phone: '19 99999-9999',
      latitude: -22.8360352,
      longitude: -47.202852,
    })
    await gymRepository.create({
      title: 'Academia TS',
      description: 'Academia com luta',
      phone: '19 99999-9999',
      latitude: -22.8360352,
      longitude: -47.202852,
    })
    await gymRepository.create({
      title: 'TS academia',
      description: 'Academia com luta',
      phone: '19 99999-9999',
      latitude: -22.8360352,
      longitude: -47.202852,
    })
    const { gyms } = await sut.execute({ query: 'TS', page: 1 })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: expect.stringContaining('TS') }),
      expect.objectContaining({ title: expect.stringContaining('TS') }),
    ])
  })

  it('should be able to fetch paginated gyms seach', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `TS academia ${i}`,
        description: 'Academia com luta',
        phone: '19 99999-9999',
        latitude: -22.8360352,
        longitude: -47.202852,
      })
    }

    const { gyms } = await sut.execute({ query: 'TS', page: 2 })
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TS academia 21' }),
      expect.objectContaining({ title: 'TS academia 22' }),
    ])
  })
})
