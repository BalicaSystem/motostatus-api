import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { MarkDelayedMotorcyclesUseCase } from '../mark-delayed-motorcycles'

export function makeMarkDelayedMotorcyclesUseCase() {
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()

  return new MarkDelayedMotorcyclesUseCase(motorcyclesRepository)
}