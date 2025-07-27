import { Gym } from '@/generated/prisma'
import { GymRepository } from '../gyms.repository'

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gyms = this.items.find((item) => {
      return item.id === id
    })
    if (!gyms) return null
    return gyms
  }
}
