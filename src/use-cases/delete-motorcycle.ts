import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import { MotorcycleHasOrderItemsError } from './errors/motorcycle-has-order-items-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteMotorcycleUseCaseRequest {
  id: string
}

export class DeleteMotorcycleUseCase {
  constructor(
    private motorcyclesRepository: MotorcyclesRepository,
    private orderItemsRepository: OrderItemsRepository,
  ) {}

  async execute({ id }: DeleteMotorcycleUseCaseRequest): Promise<void> {
    const motorcycle = await this.motorcyclesRepository.findById(id)

    if (!motorcycle) {
      throw new ResourceNotFoundError()
    }

    const orderItems = await this.orderItemsRepository.findByMotorcycleId(id)

    if (orderItems.length > 0) {
      throw new MotorcycleHasOrderItemsError()
    }

    await this.motorcyclesRepository.delete(id)
  }
}
