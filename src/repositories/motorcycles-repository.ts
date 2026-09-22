import type { Motorcycle, NewMotorcycle } from '../db/schema'

export interface FindManyMotorcyclesParams {
  limit: number
  offset: number
}

export interface UpdateMotorcycleData {
  model?: string
  estimatedArrival?: string | null
  status?: Motorcycle['status']
  chassis?: string
}

export interface MotorcyclesRepository {
  create(data: NewMotorcycle): Promise<Motorcycle | null>
  findById(id: string): Promise<Motorcycle | null>
  findMany(params: FindManyMotorcyclesParams): Promise<Motorcycle[]>
  findOverdueInTransit(upTo: string): Promise<Motorcycle[]>
  count(): Promise<number>
  findByChassis(chassis: string): Promise<Motorcycle | null>
  update(id: string, data: UpdateMotorcycleData): Promise<Motorcycle>
  delete(id: string): Promise<void>
}
