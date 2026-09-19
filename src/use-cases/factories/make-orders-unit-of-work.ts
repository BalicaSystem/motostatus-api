import { DrizzleOrdersUnitOfWork } from '../../repositories/drizzle/drizzle-orders-unit-of-work'

export function makeOrdersUnitOfWork() {
  return new DrizzleOrdersUnitOfWork()
}
