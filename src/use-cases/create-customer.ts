import type { Customer } from '../db/schema'
import type { CustomersRepository } from '../repositories/customers-repository'
import { CustomerAlreadyExistsError } from './errors/customer-already-exists-error'

interface CreateCustomerUseCaseRequest {
  name: string
  document: string
  city: string
}

interface CreateCustomerUseCaseResponse {
  customer: Customer
}

export class CreateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    name,
    document,
    city,
  }: CreateCustomerUseCaseRequest): Promise<CreateCustomerUseCaseResponse> {
    const customerWithSameDocument =
      await this.customersRepository.findByDocument(document)

    if (customerWithSameDocument) {
      throw new CustomerAlreadyExistsError()
    }

    const customer = await this.customersRepository.create({
      name,
      document,
      city,
    })

    if (!customer) {
      throw new Error('Customer could not be created')
    }

    return {
      customer,
    }
  }
}
