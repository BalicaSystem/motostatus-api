import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { FetchMotorcycleByIdUseCase } from '../fetch-motorcycle-by-id'

export function makeFetchMotorcycleUseCase() {
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()
  const useCase = new FetchMotorcycleByIdUseCase(motorcyclesRepository)

  return useCase
}
