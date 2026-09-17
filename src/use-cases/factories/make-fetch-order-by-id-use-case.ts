import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { DrizzleOrdersRepository } from '../../repositories/drizzle/drizzle-orders-repository'
import { FetchOrderByIdUseCase } from '../fetch-order-by-id'

export function makeFetchOrderByIdUseCase() {
  const ordersRepository = new DrizzleOrdersRepository()
  const orderItemsRepository = new DrizzleOrderItemsRepository()

  return new FetchOrderByIdUseCase(ordersRepository, orderItemsRepository)
}
