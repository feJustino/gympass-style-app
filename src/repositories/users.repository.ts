import { Prisma, User } from '@/generated/prisma'

export interface UserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
}
