import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { UpdateCustomerUseCase } from '../update-customer'

export function makeUpdateCustomerUseCase() {
  const customersRepository = new DrizzleCustomersRepository()

  return new UpdateCustomerUseCase(customersRepository)
}
