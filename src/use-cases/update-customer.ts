import type { Customer } from '../db/schema'
import type { CustomersRepository } from '../repositories/customers-repository'
import { CustomerAlreadyExistsError } from './errors/customer-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateCustomerUseCaseRequest {
  id: string
  name?: string
  document?: string
  city?: string
}

interface UpdateCustomerUseCaseResponse {
  customer: Customer
}

export class UpdateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    id,
    name,
    document,
    city,
  }: UpdateCustomerUseCaseRequest): Promise<UpdateCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(id)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    if (document && document !== customer.document) {
      const customerWithSameDocument =
        await this.customersRepository.findByDocument(document)

      if (
        customerWithSameDocument &&
        customerWithSameDocument.id !== customer.id
      ) {
        throw new CustomerAlreadyExistsError()
      }
    }

    const updatedCustomer = await this.customersRepository.update(id, {
      ...(name !== undefined && { name }),
      ...(document !== undefined && { document }),
      ...(city !== undefined && { city }),
    })

    return {
      customer: updatedCustomer,
    }
  }
}
