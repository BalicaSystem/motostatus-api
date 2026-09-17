import { eq, desc, count } from 'drizzle-orm'
import { db } from '../../db'
import {
  motorcycles,
  type Motorcycle,
  type NewMotorcycle,
} from '../../db/schema'
import type {
  FindManyMotorcyclesParams,
  MotorcyclesRepository,
} from '../motorcycles-repository'

export class DrizzleMotorcyclesRepository implements MotorcyclesRepository {
  updateStatus(id: string, status: Motorcycle['status']): Promise<Motorcycle> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Motorcycle | null> {
    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, id))

    return motorcycle ?? null
  }

  async findMany({ limit, offset }: FindManyMotorcyclesParams) {
    return db
      .select()
      .from(motorcycles)
      .orderBy(desc(motorcycles.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async count() {
    const [result] = await db.select({ count: count() }).from(motorcycles)

    return result?.count ?? 0
  }

  async create(data: NewMotorcycle): Promise<Motorcycle | null> {
    const [motorcycle] = await db.insert(motorcycles).values(data).returning()

    return motorcycle ?? null
  }
}
