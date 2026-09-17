import type { Order } from '../db/schema'
import type { OrdersRepository } from '../repositories/orders-repository'

interface FetchOrdersUseCaseRequest {
  page: number
  perPage: number
}

interface FetchOrdersUseCaseResponse {
  orders: Order[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

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

    const totalPages = Math.ceil(total / perPage)

    return {
      orders,
      meta: {
        page,
        perPage,
        total,
        totalPages,
      },
    }
  }
}
