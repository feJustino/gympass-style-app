import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate UseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'Fulano',
      email: 'fulano@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'fulano@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should be throw error when pass invalid email', async () => {
    await expect(
      sut.execute({
        email: 'ciclano@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should be throw error when pass wrong password', async () => {
    await userRepository.create({
      name: 'Fulano',
      email: 'fulano@example.com',
      password_hash: await hash('123456', 6),
    })
    await expect(
      sut.execute({
        email: 'fulano@example.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
