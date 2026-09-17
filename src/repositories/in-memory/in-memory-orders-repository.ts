import { randomUUID } from 'node:crypto'
import type { NewOrder, Order } from '../../db/schema'
import type {
  FindManyOrdersParams,
  OrdersRepository,
  UpdateOrderData,
} from '../orders-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async create(data: NewOrder): Promise<Order> {
    const order: Order = {
      id: data.id ?? randomUUID(),
      customerId: data.customerId,
      seller: data.seller,
      billingDate: data.billingDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(order)

    return order
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id === id)

    return order ?? null
  }

  async findMany({ limit, offset }: FindManyOrdersParams): Promise<Order[]> {
    return this.items.slice(offset, offset + limit)
  }

  async count(): Promise<number> {
    return this.items.length
  }

  async update(id: string, data: UpdateOrderData): Promise<Order> {
    const order = this.items.find((item) => item.id === id)

    if (!order) {
      throw new Error('Order not found')
    }

    Object.assign(order, {
      ...data,
      updatedAt: new Date(),
    })

    return order
  }

  async delete(id: string): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === id)

    if (orderIndex === -1) {
      throw new Error('Order not found')
    }

    this.items.splice(orderIndex, 1)
  }
}
