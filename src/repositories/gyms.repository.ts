import { Gym } from '@/generated/prisma'

export interface GymRepository {
  findById(id: string): Promise<Gym | null>
}
