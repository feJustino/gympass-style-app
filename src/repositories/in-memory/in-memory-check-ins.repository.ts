import { CheckIn, Prisma } from '@/generated/prisma'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins.repository'
import dayjs from 'dayjs'

export class InMemoryCheckinsRepository implements CheckInsRepository {
  public items: CheckIn[] = []
  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')
    const checkinOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.create_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })
    if (!checkinOnSameDate) return null
    return checkinOnSameDate
  }

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
