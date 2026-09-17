import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { FetchCustomerByIdUseCase } from '../fetch-customer-by-id'

export function makeFetchCustomerByIdUseCase() {
  const customersRepository = new DrizzleCustomersRepository()

  return new FetchCustomerByIdUseCase(customersRepository)
}
