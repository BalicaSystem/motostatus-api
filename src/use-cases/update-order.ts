import type { Order } from '../db/schema'
import type { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateOrderUseCaseRequest {
  id: string
  seller?: string
  billingDate?: string | null
}

interface UpdateOrderUseCaseResponse {
  order: Order
}

export class UpdateOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    id,
    seller,
    billingDate,
  }: UpdateOrderUseCaseRequest): Promise<UpdateOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      throw new ResourceNotFoundError()
    }

    const data = {
      ...(seller !== undefined && { seller }),
      ...(billingDate !== undefined && { billingDate }),
    }

    const updatedOrder = await this.ordersRepository.update(id, data)

    return {
      order: updatedOrder,
    }
  }
}
