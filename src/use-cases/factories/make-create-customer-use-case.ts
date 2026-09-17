import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { CreateCustomerUseCase } from '../create-customer'

export function makeCreateCustomerUseCase() {
  const customersRepository = new DrizzleCustomersRepository()

  return new CreateCustomerUseCase(customersRepository)
}
