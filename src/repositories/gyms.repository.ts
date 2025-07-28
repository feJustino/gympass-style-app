import { Gym, Prisma } from '@/generated/prisma'
export interface FindManyNearByParams {
  latitude: number
  longitude: number
}
export interface GymRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearBy(params: FindManyNearByParams): Promise<Gym[]>
}
