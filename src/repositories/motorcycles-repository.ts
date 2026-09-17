import type { Motorcycle, NewMotorcycle } from '../db/schema'

export interface MotorcyclesRepository {
  findById(id: string): Promise<Motorcycle | null>
  findMany(): Promise<Motorcycle[]>
  create(data: NewMotorcycle): Promise<Motorcycle | null>
}
