import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { UpdateOrderItemUseCase } from '../update-order-item'

export function makeUpdateOrderItemUseCase() {
  const orderItemsRepository = new DrizzleOrderItemsRepository()

  return new UpdateOrderItemUseCase(orderItemsRepository)
}
