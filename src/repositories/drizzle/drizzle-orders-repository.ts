import { count, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from '../../db'
import { customers, orders, type NewOrder, type Order } from '../../db/schema'
import type {
  FindManyOrdersParams,
  OrderSearchParams,
  OrdersRepository,
  UpdateOrderData,
} from '../orders-repository'

function orderSearchWhere(search?: string) {
  if (!search) {
    return undefined
  }

  return or(
    ilike(orders.seller, `%${search}%`),
    ilike(customers.name, `%${search}%`),
    ilike(customers.document, `%${search}%`),
  )
}

export class DrizzleOrdersRepository implements OrdersRepository {
  async create(data: NewOrder): Promise<Order | null> {
    const [order] = await db.insert(orders).values(data).returning()

    return order ?? null
  }

  async findById(id: string): Promise<Order | null> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id))

    return order ?? null
  }

  async findMany({
    limit,
    offset,
    search,
  }: FindManyOrdersParams): Promise<Order[]> {
    return db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        seller: orders.seller,
        billingDate: orders.billingDate,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .innerJoin(customers, eq(orders.customerId, customers.id))
      .where(orderSearchWhere(search))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async count({ search }: OrderSearchParams = {}): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(orders)
      .innerJoin(customers, eq(orders.customerId, customers.id))
      .where(orderSearchWhere(search))

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
