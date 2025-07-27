import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user.repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUsecase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateUsecase = new AuthenticateUseCase(usersRepository)

  return authenticateUsecase
}
