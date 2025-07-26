import { Prisma, User } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { UserRepository } from './users.repository'

export class PrismaUsersRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
