import { randomUUID } from 'node:crypto'
import type { NewOrder, NewOrderItem, Order, OrderItem } from '../../db/schema'
import type { OrdersUnitOfWork } from '../orders-unit-of-work'

export class InMemoryOrdersUnitOfWork implements OrdersUnitOfWork {
  public orders: Order[] = []
  public orderItems: OrderItem[] = []

  async createOrderWithItems(
    orderData: NewOrder,
    orderItemsData: Omit<NewOrderItem, 'orderId'>[],
  ): Promise<{
    order: Order
    orderItems: OrderItem[]
  }> {
    const order: Order = {
      id: orderData.id ?? randomUUID(),
      customerId: orderData.customerId,
      seller: orderData.seller,
      billingDate: orderData.billingDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const orderItems = orderItemsData.map((data) => ({
      id: data.id ?? randomUUID(),
      orderId: order.id,
      motorcycleId: data.motorcycleId,
      status: data.status ?? 'active',
      registrationStatus: data.registrationStatus ?? 'without_registration',
      registrationDate: data.registrationDate ?? null,
      createdAt: new Date(),
    }))

    this.orders.push(order)
    this.orderItems.push(...orderItems)

    return {
      order,
      orderItems,
    }
  }
}
