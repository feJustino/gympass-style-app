import { Gym, Prisma } from '@/generated/prisma'
import { FindManyNearByParams, GymRepository } from '../gyms.repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gyms = this.items.find((item) => {
      return item.id === id
    })
    if (!gyms) return null
    return gyms
  }

  async findManyNearBy({
    latitude,
    longitude,
  }: FindManyNearByParams): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )
      return distance < 10
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => {
        return item.title.includes(query)
      })
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }
}
