import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { DrizzleOrdersRepository } from '../../repositories/drizzle/drizzle-orders-repository'
import { FetchOrdersUseCase } from '../fetch-orders'

export function makeFetchOrdersUseCase() {
  const ordersRepository = new DrizzleOrdersRepository()
  const customersRepository = new DrizzleCustomersRepository()
  const orderItemsRepository = new DrizzleOrderItemsRepository()
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()

  return new FetchOrdersUseCase(
    ordersRepository,
    customersRepository,
    orderItemsRepository,
    motorcyclesRepository,
  )
}
