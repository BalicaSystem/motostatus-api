import type { Customer, Motorcycle, Order } from '../db/schema'
import type { CustomersRepository } from '../repositories/customers-repository'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import type { OrderItemsRepository } from '../repositories/order-items-repository'
import type { OrdersRepository } from '../repositories/orders-repository'

interface FetchOrdersUseCaseRequest {
  page: number
  perPage: number
}

interface OrderWithDetails {
  id: Order['id']
  seller: Order['seller']
  billingDate: Order['billingDate']
  createdAt: Order['createdAt']
  customer: {
    id: Customer['id']
    name: Customer['name']
    document: Customer['document']
  }
  motorcycles: {
    id: Motorcycle['id']
    model: Motorcycle['model']
    chassis: Motorcycle['chassis']
  }[]
}

interface FetchOrdersUseCaseResponse {
  orders: OrderWithDetails[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export class FetchOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private customersRepository: CustomersRepository,
    private orderItemsRepository: OrderItemsRepository,
    private motorcyclesRepository: MotorcyclesRepository,
  ) {}

  async execute({
    page,
    perPage,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const offset = (page - 1) * perPage

    const [orders, total] = await Promise.all([
      this.ordersRepository.findMany({
        limit: perPage,
        offset,
      }),
      this.ordersRepository.count(),
    ])

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const [customer, orderItems] = await Promise.all([
          this.customersRepository.findById(order.customerId),
          this.orderItemsRepository.findByOrderId(order.id),
        ])

        if (!customer) {
          throw new Error('Customer not found')
        }

        const motorcycles = await Promise.all(
          orderItems.map(async (orderItem) => {
            const motorcycle = await this.motorcyclesRepository.findById(
              orderItem.motorcycleId,
            )

            if (!motorcycle) {
              throw new Error('Motorcycle not found')
            }

            return {
              id: motorcycle.id,
              model: motorcycle.model,
              chassis: motorcycle.chassis,
            }
          }),
        )

        return {
          id: order.id,
          seller: order.seller,
          billingDate: order.billingDate,
          createdAt: order.createdAt,
          customer: {
            id: customer.id,
            name: customer.name,
            document: customer.document,
          },
          motorcycles,
        }
      }),
    )

    const totalPages = Math.ceil(total / perPage)

    return {
      orders: ordersWithDetails,
      meta: {
        page,
        perPage,
        total,
        totalPages,
      },
    }
  }
}
