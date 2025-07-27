import { describe, it, expect } from 'vitest'
import { RegisterUseCase } from './register.usecase'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'

describe('Register UseCase', () => {
  it('should be able to register', async () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryRepository)
    const { user } = await registerUseCase.execute({
      name: 'Fulano',
      email: 'fulano@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should have hashing password correctly', async () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryRepository)
    const { user } = await registerUseCase.execute({
      name: 'Fulano',
      email: 'fulano@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'fulano@example.com'
    const inMemoryRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryRepository)
    await registerUseCase.execute({
      name: 'Fulano',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Fulano 2',
        email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
