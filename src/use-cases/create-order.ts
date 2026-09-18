import type { Order, OrderItem } from '../db/schema'
import type { CustomersRepository } from '../repositories/customers-repository'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import type { OrdersUnitOfWork } from '../repositories/orders-unit-of-work'
import { MotorcycleUnavailableError } from './errors/motorcycle-unavailable-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreateOrderUseCaseRequest {
  customerId: string
  seller: string
  billingDate?: string | null
  motorcycleIds: string[]
}

interface CreateOrderUseCaseResponse {
  order: Order
  orderItems: OrderItem[]
}

export class CreateOrderUseCase {
  constructor(
    private ordersUnitOfWork: OrdersUnitOfWork,
    private customersRepository: CustomersRepository,
    private motorcyclesRepository: MotorcyclesRepository,
    private orderItemsRepository: OrderItemsRepository,
  ) {}

  async execute({
    customerId,
    seller,
    billingDate,
    motorcycleIds,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    const uniqueMotorcycleIds = new Set(motorcycleIds)

    if (uniqueMotorcycleIds.size !== motorcycleIds.length) {
      throw new MotorcycleUnavailableError()
    }

    const motorcycles = await Promise.all(
      motorcycleIds.map((motorcycleId) =>
        this.motorcyclesRepository.findById(motorcycleId),
      ),
    )

    if (motorcycles.some((motorcycle) => !motorcycle)) {
      throw new ResourceNotFoundError()
    }

    for (const motorcycleId of motorcycleIds) {
      const orderItems =
        await this.orderItemsRepository.findByMotorcycleId(motorcycleId)

      const hasActiveOrderItem = orderItems.some(
        (orderItem) => orderItem.status === 'active',
      )

      if (hasActiveOrderItem) {
        throw new MotorcycleUnavailableError()
      }
    }

    const result = await this.ordersUnitOfWork.createOrderWithItems(
      {
        customerId,
        seller,
        billingDate: billingDate ?? null,
      },
      motorcycleIds.map((motorcycleId) => ({
        motorcycleId,
        status: 'active',
        registrationStatus: 'without_registration',
        registrationDate: null,
      })),
    )

    return result
  }
}
