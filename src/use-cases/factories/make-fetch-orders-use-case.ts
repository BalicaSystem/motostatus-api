import { DrizzleOrdersRepository } from '../../repositories/drizzle/drizzle-orders-repository'
import { FetchOrdersUseCase } from '../fetch-orders'

export function makeFetchOrdersUseCase() {
  const ordersRepository = new DrizzleOrdersRepository()

  return new FetchOrdersUseCase(ordersRepository)
}
