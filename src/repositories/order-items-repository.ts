import type { NewOrderItem, OrderItem } from '../db/schema'

export interface OrderItemsRepository {
  create(data: NewOrderItem): Promise<OrderItem | null>
  findById(id: string): Promise<OrderItem | null>
  findByOrderId(orderId: string): Promise<OrderItem[]>
  findByMotorcycleId(motorcycleId: string): Promise<OrderItem[]>
  delete(id: string): Promise<void>
  deleteByOrderId(orderId: string): Promise<void>
}
