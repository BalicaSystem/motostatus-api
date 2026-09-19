import type { NewOrder, Order } from '../db/schema'

export interface FindManyOrdersParams {
  limit: number
  offset: number
}

export interface UpdateOrderData {
  seller?: string
  billingDate?: string | null
}

export interface OrdersRepository {
  create(data: NewOrder): Promise<Order | null>
  findById(id: string): Promise<Order | null>
  findMany(params: FindManyOrdersParams): Promise<Order[]>
  count(): Promise<number>
  update(id: string, data: UpdateOrderData): Promise<Order>
  delete(id: string): Promise<void>
}
