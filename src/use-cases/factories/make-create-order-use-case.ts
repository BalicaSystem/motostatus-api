import { DrizzleCustomersRepository } from '../../repositories/drizzle/drizzle-customers-repository'
import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { DrizzleOrdersRepository } from '../../repositories/drizzle/drizzle-orders-repository'
import { CreateOrderUseCase } from '../create-order'

export function makeCreateOrderUseCase() {
  const ordersRepository = new DrizzleOrdersRepository()
  const orderItemsRepository = new DrizzleOrderItemsRepository()
  const customersRepository = new DrizzleCustomersRepository()
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()

  return new CreateOrderUseCase(
    ordersRepository,
    orderItemsRepository,
    customersRepository,
    motorcyclesRepository,
  )
}
