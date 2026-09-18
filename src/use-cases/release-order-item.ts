import type { OrderItem } from '../db/schema'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import { OrderItemCannotBeReleasedError } from './errors/order-item-cannot-be-released-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ReleaseOrderItemUseCaseRequest {
  id: string
}

interface ReleaseOrderItemUseCaseResponse {
  orderItem: OrderItem
}

export class ReleaseOrderItemUseCase {
  constructor(private orderItemsRepository: OrderItemsRepository) {}

  async execute({
    id,
  }: ReleaseOrderItemUseCaseRequest): Promise<ReleaseOrderItemUseCaseResponse> {
    const orderItem = await this.orderItemsRepository.findById(id)

    if (!orderItem) {
      throw new ResourceNotFoundError()
    }

    if (orderItem.status !== 'active') {
      throw new OrderItemCannotBeReleasedError()
    }

    const updatedOrderItem = await this.orderItemsRepository.update(id, {
      status: 'released',
    })

    return {
      orderItem: updatedOrderItem,
    }
  }
}
