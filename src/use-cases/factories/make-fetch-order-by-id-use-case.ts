import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { DrizzleOrdersRepository } from '../../repositories/drizzle/drizzle-orders-repository'
import { FetchOrderByIdUseCase } from '../fetch-order-by-id'

export function makeFetchOrderByIdUseCase() {
  const ordersRepository = new DrizzleOrdersRepository()
  const customersRepository = new DrizzleCustomersRepository()
  const orderItemsRepository = new DrizzleOrderItemsRepository()
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()

  return new FetchOrderByIdUseCase(
    ordersRepository,
    customersRepository,
    orderItemsRepository,
    motorcyclesRepository,
  )
}
