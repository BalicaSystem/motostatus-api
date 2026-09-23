import type { NewOrder, Order } from '../db/schema'

export interface FindManyOrdersParams {
  limit: number
  offset: number
  search?: string
}

export interface OrderSearchParams {
  search?: string
}

export interface UpdateOrderData {
  seller?: string
  billingDate?: string | null
}

export interface OrdersRepository {
  create(data: NewOrder): Promise<Order | null>
  findById(id: string): Promise<Order | null>
  findMany(params: FindManyOrdersParams): Promise<Order[]>
  count(params?: OrderSearchParams): Promise<number>
  update(id: string, data: UpdateOrderData): Promise<Order>
  delete(id: string): Promise<void>
}
