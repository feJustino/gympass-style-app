import { CheckIn, Prisma } from '@/generated/prisma'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins.repository'

export class InMemoryCheckinsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validate_at: data.validate_at ? new Date(data.validate_at) : null,
      create_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }
}
