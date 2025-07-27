import { Prisma, User } from '@/generated/prisma'
import { UserRepository } from '../users.repository'

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => {
      return item.email === email
    })
    if (!user) return null
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      create_at: new Date(),
    }
    this.items.push(user)
    return user
  }
}
