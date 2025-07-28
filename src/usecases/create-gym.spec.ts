import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymRepository
let sut: CreateGymUseCase

describe('Register UseCase', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      title: 'Academia Node',
      description: 'Academia com pesos',
      phone: '19 99999-9999',
      latitude: -22.8360352,
      longitude: -47.202852,
    })
    expect(gym.id).toEqual(expect.any(String))
  })
})
