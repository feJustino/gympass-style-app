import { Gym, Prisma } from '@/generated/prisma'
import { FindManyNearByParams, GymRepository } from '../gyms.repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymRepository {
  async findById(id: string) {
    return await prisma.gym.findUnique({
      where: { id },
    })
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })
    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: { contains: query },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async findManyNearBy({ latitude, longitude }: FindManyNearByParams) {
    const gym = await prisma.$queryRaw<Gym[]>`
     SELECT  * FROM gyms
     WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gym
  }
}
