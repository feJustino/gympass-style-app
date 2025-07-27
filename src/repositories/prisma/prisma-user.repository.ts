import { Prisma, User } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { UserRepository } from '@/repositories/users.repository'

export class PrismaUsersRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
