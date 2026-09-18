import { db } from '../../db'
import {
  orderItems,
  orders,
  type NewOrder,
  type NewOrderItem,
  type Order,
  type OrderItem,
} from '../../db/schema'
import type { OrdersUnitOfWork } from '../orders-unit-of-work'

type NewOrderItemData = Omit<NewOrderItem, 'orderId'>

export class DrizzleOrdersUnitOfWork implements OrdersUnitOfWork {
  async createOrderWithItems(
    order: NewOrder,
    orderItemsData: NewOrderItemData[],
  ): Promise<{
    order: Order
    orderItems: OrderItem[]
  }> {
    return db.transaction(async (tx) => {
      const [createdOrder] = await tx.insert(orders).values(order).returning()

      if (!createdOrder) {
        throw new Error('Order could not be created')
      }

      const createdOrderItems = await tx
        .insert(orderItems)
        .values(
          orderItemsData.map((orderItem) => ({
            ...orderItem,
            orderId: createdOrder.id,
          })),
        )
        .returning()

      if (createdOrderItems.length !== orderItemsData.length) {
        throw new Error('Order items could not be created')
      }

      return {
        order: createdOrder,
        orderItems: createdOrderItems,
      }
    })
  }
}
