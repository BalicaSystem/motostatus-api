import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { CreateOrderUseCase } from '../create-order'
import { makeOrdersUnitOfWork } from './make-orders-unit-of-work'

export function makeCreateOrderUseCase() {
  const ordersUnitOfWork = makeOrdersUnitOfWork()
  const customersRepository = new DrizzleCustomersRepository()
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()
  const orderItemsRepository = new DrizzleOrderItemsRepository()

  return new CreateOrderUseCase(
    ordersUnitOfWork,
    customersRepository,
    motorcyclesRepository,
    orderItemsRepository,
  )
}
