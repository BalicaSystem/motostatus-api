import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { CheckInMotorcycleUseCase } from '../check-in-motorcycle'

export function makeCheckInMotorcycleUseCase() {
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()

  return new CheckInMotorcycleUseCase(motorcyclesRepository)
}