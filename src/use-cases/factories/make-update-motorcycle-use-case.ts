import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { UpdateMotorcycleUseCase } from '../update-motorcycle'

export function makeUpdateMotorcycleUseCase() {
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()
  const useCase = new UpdateMotorcycleUseCase(motorcyclesRepository)

  return useCase
}
