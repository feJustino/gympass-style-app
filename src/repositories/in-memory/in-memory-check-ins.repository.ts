import { CheckIn, Prisma } from '@/generated/prisma'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins.repository'
import dayjs from 'dayjs'

export class InMemoryCheckinsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)
    if (!checkIn) return null
    return checkIn
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkinOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.create_at)
      const isOnSameDate = checkInDate.isSame(date, 'dates')
      return checkIn.user_id === userId && isOnSameDate
    })
    if (!checkinOnSameDate) return null
    return checkinOnSameDate
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex(({ id }) => checkIn.id === id)

    if (checkInIndex > 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
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
