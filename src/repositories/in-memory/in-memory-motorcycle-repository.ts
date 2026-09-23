import { randomUUID } from 'node:crypto'
import type { Motorcycle, NewMotorcycle } from '../../db/schema'
import type {
  FindManyMotorcyclesParams,
  MotorcycleSearchParams,
  MotorcyclesRepository,
} from '../motorcycles-repository'

export class InMemoryMotorcycleRepository implements MotorcyclesRepository {
  public items: Motorcycle[] = []

  private matchesSearch(motorcycle: Motorcycle, search: string) {
    const term = search.toLowerCase()

    return (
      motorcycle.model.toLowerCase().includes(term) ||
      motorcycle.chassis.toLowerCase().includes(term)
    )
  }

  private matchesFilters(
    motorcycle: Motorcycle,
    { search, status }: MotorcycleSearchParams,
  ) {
    if (status && motorcycle.status !== status) {
      return false
    }

    if (search && !this.matchesSearch(motorcycle, search)) {
      return false
    }

    return true
  }

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

  async findMany({
    limit,
    offset,
    search,
    status,
  }: FindManyMotorcyclesParams): Promise<Motorcycle[]> {
    const filtered = this.items.filter((item) =>
      this.matchesFilters(item, { search, status }),
    )

    return filtered.slice(offset, offset + limit)
  }

  async findOverdueInTransit(upTo: string): Promise<Motorcycle[]> {
    return this.items.filter(
      (item) =>
        item.status === 'in_transit' &&
        item.estimatedArrival !== null &&
        item.estimatedArrival < upTo,
    )
  }

  async count({
    search,
    status,
  }: MotorcycleSearchParams = {}): Promise<number> {
    return this.items.filter((item) =>
      this.matchesFilters(item, { search, status }),
    ).length
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

  async delete(id: string): Promise<void> {
    const motorcycleIndex = this.items.findIndex((item) => item.id === id)

    if (motorcycleIndex === -1) {
      throw new Error('Motorcycle not found')
    }

    this.items.splice(motorcycleIndex, 1)
  }
}
