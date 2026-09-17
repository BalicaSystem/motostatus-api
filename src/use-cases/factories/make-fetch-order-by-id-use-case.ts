import { DrizzleOrdersRepository } from '../../repositories/drizzle/drizzle-orders-repository'
import { FetchOrderByIdUseCase } from '../fetch-order-by-id'

export function makeFetchOrderByIdUseCase() {
  const ordersRepository = new DrizzleOrdersRepository()

  return new FetchOrderByIdUseCase(ordersRepository)
}
