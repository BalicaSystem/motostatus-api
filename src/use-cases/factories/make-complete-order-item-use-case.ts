import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { CompleteOrderItemUseCase } from '../complete-order-item'

export function makeCompleteOrderItemUseCase() {
  const orderItemsRepository = new DrizzleOrderItemsRepository()

  return new CompleteOrderItemUseCase(orderItemsRepository)
}
