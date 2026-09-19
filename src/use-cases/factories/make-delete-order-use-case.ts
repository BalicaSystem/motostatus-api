import { DrizzleOrdersRepository } from '../../repositories/drizzle/drizzle-orders-repository'
import { DeleteOrderUseCase } from '../delete-order'

export function makeDeleteOrderUseCase() {
  const ordersRepository = new DrizzleOrdersRepository()

  return new DeleteOrderUseCase(ordersRepository)
}
