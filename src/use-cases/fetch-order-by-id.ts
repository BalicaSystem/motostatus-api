import type { Order, OrderItem } from '../db/schema'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import type { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchOrderByIdUseCaseRequest {
  id: string
}

interface FetchOrderByIdUseCaseResponse {
  order: Order
  orderItems: OrderItem[]
}

export class FetchOrderByIdUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private orderItemsRepository: OrderItemsRepository,
  ) {}

  async execute({
    id,
  }: FetchOrderByIdUseCaseRequest): Promise<FetchOrderByIdUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      throw new ResourceNotFoundError()
    }

    const orderItems = await this.orderItemsRepository.findByOrderId(order.id)

    return {
      order,
      orderItems,
    }
  }
}
