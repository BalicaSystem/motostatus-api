import type { Order } from '../db/schema'
import type { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchOrderByIdUseCaseRequest {
  id: string
}

interface FetchOrderByIdUseCaseResponse {
  order: Order
}

export class FetchOrderByIdUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    id,
  }: FetchOrderByIdUseCaseRequest): Promise<FetchOrderByIdUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      throw new ResourceNotFoundError()
    }

    return {
      order,
    }
  }
}
