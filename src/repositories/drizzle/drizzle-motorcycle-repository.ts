import { eq, desc } from 'drizzle-orm'
import { db } from '../../db'
import {
  motorcycles,
  type Motorcycle,
  type NewMotorcycle,
} from '../../db/schema'
import type { MotorcyclesRepository } from '../motorcycles-repository'

export class DrizzleMotorcyclesRepository implements MotorcyclesRepository {
  async findById(id: string): Promise<Motorcycle | null> {
    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, id))

    return motorcycle ?? null
  }

  async findMany(): Promise<Motorcycle[]> {
    return db.select().from(motorcycles).orderBy(desc(motorcycles.createdAt))
  }

  async create(data: NewMotorcycle): Promise<Motorcycle | null> {
    const [motorcycle] = await db.insert(motorcycles).values(data).returning()

    return motorcycle ?? null
  }
}
