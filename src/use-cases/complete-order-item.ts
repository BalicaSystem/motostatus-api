import type { OrderItem } from '../db/schema'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export class OrderItemCannotBeCompletedError extends Error {
  constructor() {
    super('Order item cannot be completed.')
  }
}

interface CompleteOrderItemUseCaseRequest {
  id: string
}

interface CompleteOrderItemUseCaseResponse {
  orderItem: OrderItem
}

export class CompleteOrderItemUseCase {
  constructor(private orderItemsRepository: OrderItemsRepository) {}

  async execute({
    id,
  }: CompleteOrderItemUseCaseRequest): Promise<CompleteOrderItemUseCaseResponse> {
    const orderItem = await this.orderItemsRepository.findById(id)

    if (!orderItem) {
      throw new ResourceNotFoundError()
    }

    if (orderItem.status !== 'active') {
      throw new OrderItemCannotBeCompletedError()
    }

    const updatedOrderItem = await this.orderItemsRepository.update(id, {
      status: 'completed',
    })

    return {
      orderItem: updatedOrderItem,
    }
  }
}
