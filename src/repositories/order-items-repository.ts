import type { NewOrderItem, OrderItem } from '../db/schema'

export interface UpdateOrderItemData {
  status?: OrderItem['status']
  registrationStatus?: OrderItem['registrationStatus']
  registrationDate?: string | null
}

export interface OrderItemsRepository {
  create(data: NewOrderItem): Promise<OrderItem | null>
  findById(id: string): Promise<OrderItem | null>
  findByOrderId(orderId: string): Promise<OrderItem[]>
  findByMotorcycleId(motorcycleId: string): Promise<OrderItem[]>
  update(id: string, data: UpdateOrderItemData): Promise<OrderItem>
  delete(id: string): Promise<void>
  deleteByOrderId(orderId: string): Promise<void>
}
