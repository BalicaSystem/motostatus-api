import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { CreateMotorcycleUseCase } from '../create-motorcycle'

export function makeCreateMotorcycleUseCase() {
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()
  const useCase = new CreateMotorcycleUseCase(motorcyclesRepository)

  return useCase
}
