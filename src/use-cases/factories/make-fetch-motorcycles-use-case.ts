import { DrizzleMotorcyclesRepository } from '../../repositories/drizzle/drizzle-motorcycle-repository'
import { FetchMotorcyclesUseCase } from '../fetch-motorcycles'

export function makeFetchMotorcyclesUseCase() {
  const motorcyclesRepository = new DrizzleMotorcyclesRepository()
  const useCase = new FetchMotorcyclesUseCase(motorcyclesRepository)

  return useCase
}
