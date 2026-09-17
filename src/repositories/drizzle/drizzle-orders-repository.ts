import { count, desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { orders, type NewOrder, type Order } from '../../db/schema'
import type {
  FindManyOrdersParams,
  OrdersRepository,
  UpdateOrderData,
} from '../orders-repository'

export class DrizzleOrdersRepository implements OrdersRepository {
  async create(data: NewOrder): Promise<Order | null> {
    const [order] = await db.insert(orders).values(data).returning()

    return order ?? null
  }

  async findById(id: string): Promise<Order | null> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id))

    return order ?? null
  }

  async findMany({ limit, offset }: FindManyOrdersParams): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async count(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(orders)

    return result?.count ?? 0
  }

  async update(id: string, data: UpdateOrderData): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning()

    return order!
  }

  async delete(id: string): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id))
  }
}
