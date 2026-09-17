import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { orderItems, type NewOrderItem, type OrderItem } from '../../db/schema'
import type {
  OrderItemsRepository,
  UpdateOrderItemData,
} from '../order-items-repository'

export class DrizzleOrderItemsRepository implements OrderItemsRepository {
  async create(data: NewOrderItem): Promise<OrderItem | null> {
    const [orderItem] = await db.insert(orderItems).values(data).returning()

    return orderItem ?? null
  }

  async findById(id: string): Promise<OrderItem | null> {
    const [orderItem] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, id))

    return orderItem ?? null
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
  }

  async findByMotorcycleId(motorcycleId: string): Promise<OrderItem[]> {
    return db
      .select()
      .from(orderItems)
      .where(eq(orderItems.motorcycleId, motorcycleId))
  }

  async delete(id: string): Promise<void> {
    await db.delete(orderItems).where(eq(orderItems.id, id))
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId))
  }

  async update(id: string, data: UpdateOrderItemData): Promise<OrderItem> {
    const [orderItem] = await db
      .update(orderItems)
      .set(data)
      .where(eq(orderItems.id, id))
      .returning()

    if (!orderItem) {
      throw new Error('Order item not found')
    }

    return orderItem
  }
}
