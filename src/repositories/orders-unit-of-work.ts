import type { NewOrder, NewOrderItem, Order, OrderItem } from '../db/schema'

type NewOrderItemData = Omit<NewOrderItem, 'orderId'>

export interface OrdersUnitOfWork {
  createOrderWithItems(
    order: NewOrder,
    orderItems: NewOrderItemData[],
  ): Promise<{
    order: Order
    orderItems: OrderItem[]
  }>
}
