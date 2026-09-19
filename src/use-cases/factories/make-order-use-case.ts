import { DrizzleOrdersRepository } from '../../repositories/drizzle/drizzle-orders-repository'
import { UpdateOrderUseCase } from '../update-order'

export function makeUpdateOrderUseCase() {
  const ordersRepository = new DrizzleOrdersRepository()

  return new UpdateOrderUseCase(ordersRepository)
}
