import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { FetchCustomersUseCase } from '../fetch-customers'

export function makeFetchCustomersUseCase() {
  const customersRepository = new DrizzleCustomersRepository()

  return new FetchCustomersUseCase(customersRepository)
}
