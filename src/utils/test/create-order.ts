import { randomUUID } from 'node:crypto'
import { orderItems, orders } from '../../db/schema'
import { db } from '../../db'

interface CreateOrderData {
  customerId: string
  motorcycleIds: string[]
  seller?: string
  billingDate?: string | null
}

export async function createOrder(data: CreateOrderData) {
  const [order] = await db
    .insert(orders)
    .values({
      customerId: data.customerId,
      seller: data.seller ?? 'João Vendedor',
      billingDate: data.billingDate ?? null,
    })
    .returning()

  const createdOrderItems = await db
    .insert(orderItems)
    .values(
      data.motorcycleIds.map((motorcycleId) => ({
        id: randomUUID(),
        orderId: order.id,
        motorcycleId,
        status: 'active' as const,
        registrationStatus: 'without_registration' as const,
        registrationDate: null,
      })),
    )
    .returning()

  return {
    order,
    orderItems: createdOrderItems,
  }
}
