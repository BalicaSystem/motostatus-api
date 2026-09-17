import type { Motorcycle, NewMotorcycle } from '../db/schema'

export interface FindManyMotorcyclesParams {
  limit: number
  offset: number
}

export interface MotorcyclesRepository {
  create(data: NewMotorcycle): Promise<Motorcycle | null>
  findById(id: string): Promise<Motorcycle | null>
  findMany(params: FindManyMotorcyclesParams): Promise<Motorcycle[]>
  count(): Promise<number>
  updateStatus(id: string, status: Motorcycle['status']): Promise<Motorcycle>
}
