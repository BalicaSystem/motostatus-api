import type { Customer } from '../db/schema'
import type { CustomersRepository } from '../repositories/customers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchCustomerByIdUseCaseRequest {
  id: string
}

interface FetchCustomerByIdUseCaseResponse {
  customer: Customer
}

export class FetchCustomerByIdUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    id,
  }: FetchCustomerByIdUseCaseRequest): Promise<FetchCustomerByIdUseCaseResponse> {
    const customer = await this.customersRepository.findById(id)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    return {
      customer,
    }
  }
}
