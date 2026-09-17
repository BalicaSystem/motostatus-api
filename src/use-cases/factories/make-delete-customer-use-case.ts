import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { DeleteCustomerUseCase } from '../delete-customer'

export function makeDeleteCustomerUseCase() {
  const customersRepository = new DrizzleCustomersRepository()

  return new DeleteCustomerUseCase(customersRepository)
}
