import { eq } from 'drizzle-orm'
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
  findMany(): Promise<Motorcycle[]> {
    throw new Error('Method not implemented.')
  }
  create(data: NewMotorcycle): Promise<Motorcycle> {
    throw new Error('Method not implemented.')
  }
}
