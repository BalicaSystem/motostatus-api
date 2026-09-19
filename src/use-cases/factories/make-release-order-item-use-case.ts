import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { ReleaseOrderItemUseCase } from '../release-order-item'

export function makeReleaseOrderItemUseCase() {
  const orderItemsRepository = new DrizzleOrderItemsRepository()

  return new ReleaseOrderItemUseCase(orderItemsRepository)
}
