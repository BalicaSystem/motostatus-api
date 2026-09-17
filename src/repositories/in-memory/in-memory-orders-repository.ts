import { randomUUID } from 'node:crypto'
import type { NewOrder, Order } from '../../db/schema'
import type {
  FindManyOrdersParams,
  OrdersRepository,
  UpdateOrderData,
} from '../orders-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
  public orders: Order[] = []

  async create(data: NewOrder): Promise<Order> {
    const order: Order = {
      id: data.id ?? randomUUID(),
      customerId: data.customerId,
      seller: data.seller,
      billingDate: data.billingDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.orders.push(order)

    return order
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id)

    return order ?? null
  }

  async findMany({ limit, offset }: FindManyOrdersParams): Promise<Order[]> {
    return this.orders.slice(offset, offset + limit)
  }

  async count(): Promise<number> {
    return this.orders.length
  }

  async update(id: string, data: UpdateOrderData): Promise<Order> {
    const orderIndex = this.orders.findIndex((order) => order.id === id)

    if (orderIndex === -1) {
      throw new Error('Order not found')
    }

    const order = this.orders[orderIndex]

    const updatedOrder: Order = {
      ...order,
      ...data,
      updatedAt: new Date(),
    }

    this.orders[orderIndex] = updatedOrder

    return updatedOrder
  }

  async delete(id: string): Promise<void> {
    const orderIndex = this.orders.findIndex((order) => order.id === id)

    if (orderIndex === -1) {
      throw new Error('Order not found')
    }

    this.orders.splice(orderIndex, 1)
  }
}
