import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { DrizzleOrderItemsRepository } from '../../repositories/drizzle/drizzle-order-items-repository'
import { DeleteMotorcycleUseCase } from '../delete-motorcycle'

export function makeDeleteMotorcycleUseCase() {
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()
  const orderItemsRepository = new DrizzleOrderItemsRepository()

  return new DeleteMotorcycleUseCase(
    motorcyclesRepository,
    orderItemsRepository,
  )
}
