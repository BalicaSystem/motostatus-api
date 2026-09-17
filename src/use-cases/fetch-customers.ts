import type { Customer } from '../db/schema'
import type { CustomersRepository } from '../repositories/customers-repository'

interface FetchCustomersUseCaseRequest {
  page?: number
  perPage?: number
}

interface FetchCustomersUseCaseResponse {
  customers: Customer[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export class FetchCustomersUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    page = 1,
    perPage = 20,
  }: FetchCustomersUseCaseRequest): Promise<FetchCustomersUseCaseResponse> {
    const offset = (page - 1) * perPage

    const [customers, total] = await Promise.all([
      this.customersRepository.findMany({
        limit: perPage,
        offset,
      }),
      this.customersRepository.count(),
    ])

    return {
      customers,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    }
  }
}
