import type { Motorcycle, NewMotorcycle } from '../../db/schema'
import type { MotorcyclesRepository } from '../motorcycles-repository'
import { randomUUID } from 'crypto'

export class InMemoryMotorcycleRepository implements MotorcyclesRepository {
  public items: Motorcycle[] = []

  async findById(id: string) {
    const motorcycle = this.items.find((item) => item.id === id)

    if (!motorcycle) {
      return null
    }

    return motorcycle
  }

  async findMany(): Promise<Motorcycle[]> {
    return this.items
  }

  async create(data: NewMotorcycle) {
    const motorcycle: Motorcycle = {
      id: data.id ?? randomUUID(),
      chassis: data.chassis,
      model: data.model,
      status: data.status || 'in_transit',
      estimatedArrival: data.estimatedArrival as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(motorcycle)

    return motorcycle
  }
}
