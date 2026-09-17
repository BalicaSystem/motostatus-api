import type { OrderItem } from '../db/schema'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateOrderItemUseCaseRequest {
  id: string
  registrationStatus?: OrderItem['registrationStatus']
  registrationDate?: string | null
}

interface UpdateOrderItemUseCaseResponse {
  orderItem: OrderItem
}

export class UpdateOrderItemUseCase {
  constructor(private orderItemsRepository: OrderItemsRepository) {}

  async execute({
    id,
    registrationStatus,
    registrationDate,
  }: UpdateOrderItemUseCaseRequest): Promise<UpdateOrderItemUseCaseResponse> {
    const orderItem = await this.orderItemsRepository.findById(id)

    if (!orderItem) {
      throw new ResourceNotFoundError()
    }

    const data = {
      ...(registrationStatus !== undefined && { registrationStatus }),
      ...(registrationDate !== undefined && { registrationDate }),
    }

    const updatedOrderItem = await this.orderItemsRepository.update(id, data)

    return {
      orderItem: updatedOrderItem,
    }
  }
}
