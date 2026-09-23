import { and, count, desc, eq, ilike, lt, or } from 'drizzle-orm'
import { db } from '../../db'
import {
  motorcycles,
  type Motorcycle,
  type NewMotorcycle,
} from '../../db/schema'
import type {
  FindManyMotorcyclesParams,
  MotorcycleSearchParams,
  MotorcyclesRepository,
} from '../motorcycles-repository'

function motorcycleWhere({ search, status }: MotorcycleSearchParams) {
  return and(
    status ? eq(motorcycles.status, status) : undefined,
    search
      ? or(
          ilike(motorcycles.model, `%${search}%`),
          ilike(motorcycles.chassis, `%${search}%`),
        )
      : undefined,
  )
}

export class DrizzleMotorcyclesRepository implements MotorcyclesRepository {
  async findById(id: string): Promise<Motorcycle | null> {
    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, id))

    return motorcycle ?? null
  }

  async findByChassis(chassis: string): Promise<Motorcycle | null> {
    const [motorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.chassis, chassis))

    return motorcycle ?? null
  }

  async findMany({ limit, offset, search, status }: FindManyMotorcyclesParams) {
    return db
      .select()
      .from(motorcycles)
      .where(motorcycleWhere({ search, status }))
      .orderBy(desc(motorcycles.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async findOverdueInTransit(upTo: string): Promise<Motorcycle[]> {
    return db
      .select()
      .from(motorcycles)
      .where(
        and(
          eq(motorcycles.status, 'in_transit'),
          lt(motorcycles.estimatedArrival, upTo),
        ),
      )
  }

  async count({ search, status }: MotorcycleSearchParams = {}) {
    const [result] = await db
      .select({ count: count() })
      .from(motorcycles)
      .where(motorcycleWhere({ search, status }))

    return result?.count ?? 0
  }

  async create(data: NewMotorcycle): Promise<Motorcycle | null> {
    const [motorcycle] = await db.insert(motorcycles).values(data).returning()

    return motorcycle ?? null
  }

  async update(
    id: string,
    data: Partial<
      Pick<Motorcycle, 'model' | 'chassis' | 'estimatedArrival' | 'status'>
    >,
  ): Promise<Motorcycle> {
    const [motorcycle] = await db
      .update(motorcycles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(motorcycles.id, id))
      .returning()

    return motorcycle!
  }

  async delete(id: string): Promise<void> {
    await db.delete(motorcycles).where(eq(motorcycles.id, id))
  }
}
