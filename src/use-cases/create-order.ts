import type { Order, OrderItem } from '../db/schema'
import type { CustomersRepository } from '../repositories/customers-repository'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import type { OrdersRepository } from '../repositories/orders-repository'
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
    private ordersRepository: OrdersRepository,
    private orderItemsRepository: OrderItemsRepository,
    private customersRepository: CustomersRepository,
    private motorcyclesRepository: MotorcyclesRepository,
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
    }

    const order = await this.ordersRepository.create({
      customerId,
      seller,
      billingDate: billingDate ?? null,
    })

    if (!order) {
      throw new Error('Order could not be created')
    }

    const orderItems = []

    for (const motorcycleId of motorcycleIds) {
      const orderItem = await this.orderItemsRepository.create({
        orderId: order.id,
        motorcycleId,
      })

      if (!orderItem) {
        throw new Error('Order item could not be created')
      }

      orderItems.push(orderItem)
    }

    return {
      order,
      orderItems,
    }
  }
}
