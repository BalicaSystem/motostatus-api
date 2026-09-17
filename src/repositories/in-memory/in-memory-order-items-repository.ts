import { randomUUID } from 'node:crypto'
import type { NewOrderItem, OrderItem } from '../../db/schema'
import type { OrderItemsRepository } from '../order-items-repository'

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  public items: OrderItem[] = []

  async create(data: NewOrderItem): Promise<OrderItem> {
    const orderItem: OrderItem = {
      id: data.id ?? randomUUID(),
      orderId: data.orderId,
      motorcycleId: data.motorcycleId,
      registrationStatus: data.registrationStatus ?? 'without_registration',
      registrationDate: data.registrationDate ?? null,
      createdAt: new Date(),
    }

    this.items.push(orderItem)

    return orderItem
  }

  async findById(id: string): Promise<OrderItem | null> {
    const orderItem = this.items.find((item) => item.id === id)

    return orderItem ?? null
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return this.items.filter((item) => item.orderId === orderId)
  }

  async findByMotorcycleId(motorcycleId: string): Promise<OrderItem[]> {
    return this.items.filter((item) => item.motorcycleId === motorcycleId)
  }

  async delete(id: string): Promise<void> {
    const orderItemIndex = this.items.findIndex((item) => item.id === id)

    if (orderItemIndex === -1) {
      throw new Error('Order item not found')
    }

    this.items.splice(orderItemIndex, 1)
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    this.items = this.items.filter((item) => item.orderId !== orderId)
  }
}
