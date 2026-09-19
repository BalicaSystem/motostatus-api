import { randomUUID } from 'node:crypto'
import type { Motorcycle, NewMotorcycle } from '../../db/schema'
import type { MotorcyclesRepository } from '../motorcycles-repository'

export class InMemoryMotorcycleRepository implements MotorcyclesRepository {
  public items: Motorcycle[] = []

  async findById(id: string) {
    const motorcycle = this.items.find((item) => item.id === id)

    if (!motorcycle) {
      return null
    }

    return motorcycle
  }

  async findByChassis(chassis: string) {
    const motorcycle = this.items.find((item) => item.chassis === chassis)

    if (!motorcycle) {
      return null
    }

    return motorcycle
  }

  async findMany(): Promise<Motorcycle[]> {
    return this.items
  }

  async findOverdueInTransit(upTo: string): Promise<Motorcycle[]> {
    return this.items.filter(
      (item) =>
        item.status === 'in_transit' &&
        item.estimatedArrival !== null &&
        item.estimatedArrival < upTo,
    )
  }

  async count(): Promise<number> {
    return this.items.length
  }

  async create(data: NewMotorcycle) {
    const motorcycle: Motorcycle = {
      id: data.id ?? randomUUID(),
      chassis: data.chassis,
      model: data.model,
      status: data.status ?? 'in_transit',
      estimatedArrival: data.estimatedArrival ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(motorcycle)

    return motorcycle
  }

  async update(
    id: string,
    data: Partial<
      Pick<Motorcycle, 'model' | 'chassis' | 'estimatedArrival' | 'status'>
    >,
  ) {
    const motorcycle = this.items.find((item) => item.id === id)

    if (!motorcycle) {
      throw new Error('Motorcycle not found')
    }

    Object.assign(motorcycle, {
      ...data,
      updatedAt: new Date(),
    })

    return motorcycle
  }
}
