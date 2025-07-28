import { Prisma, CheckIn } from '@/generated/prisma'
import { CheckInsRepository } from '../check-ins.repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })
    return checkIn
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    })
    return checkIn
  }

  async findById(id: string) {
    return await prisma.checkIn.findUnique({
      where: { id },
    })
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDate = dayjs(date).startOf('date')
    const endOfDate = dayjs(date).endOf('date')
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        create_at: {
          gte: startOfDate.toDate(),
          lte: endOfDate.toDate(),
        },
      },
    })
    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }
}
