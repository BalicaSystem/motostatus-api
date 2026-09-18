import type { Customer, Motorcycle, Order, OrderItem } from '../db/schema'
import type { CustomersRepository } from '../repositories/customers-repository'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import type { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchOrderByIdUseCaseRequest {
  id: string
}

interface OrderItemWithMotorcycle extends OrderItem {
  motorcycle: Motorcycle
}

interface OrderWithDetails extends Order {
  customer: Customer
}

interface FetchOrderByIdUseCaseResponse {
  order: OrderWithDetails
  orderItems: OrderItemWithMotorcycle[]
}

export class FetchOrderByIdUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private customersRepository: CustomersRepository,
    private orderItemsRepository: OrderItemsRepository,
    private motorcyclesRepository: MotorcyclesRepository,
  ) {}

  async execute({
    id,
  }: FetchOrderByIdUseCaseRequest): Promise<FetchOrderByIdUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      throw new ResourceNotFoundError()
    }

    const customer = await this.customersRepository.findById(order.customerId)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    const orderItems = await this.orderItemsRepository.findByOrderId(order.id)

    const orderItemsWithMotorcycles = await Promise.all(
      orderItems.map(async (orderItem) => {
        const motorcycle = await this.motorcyclesRepository.findById(
          orderItem.motorcycleId,
        )

        if (!motorcycle) {
          throw new ResourceNotFoundError()
        }

        return {
          ...orderItem,
          motorcycle,
        }
      }),
    )

    return {
      order: {
        ...order,
        customer,
      },
      orderItems: orderItemsWithMotorcycles,
    }
  }
}
