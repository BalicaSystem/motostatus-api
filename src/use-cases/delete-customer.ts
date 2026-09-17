import type { CustomersRepository } from '../repositories/customers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteCustomerUseCaseRequest {
  id: string
}

export class DeleteCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({ id }: DeleteCustomerUseCaseRequest): Promise<void> {
    const customer = await this.customersRepository.findById(id)

    if (!customer) {
      throw new ResourceNotFoundError()
    }

    await this.customersRepository.delete(id)
  }
}
