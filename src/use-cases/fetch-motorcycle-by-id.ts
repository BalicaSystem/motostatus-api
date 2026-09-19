import type { Motorcycle } from '../db/schema'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface MotorcycleUseCaseRequest {
  id: string
}

interface MotorcycleUseCaseResponse {
  motorcycle: Motorcycle
}

export class FetchMotorcycleByIdUseCase {
  constructor(private motorcyclesRepository: MotorcyclesRepository) {}

  async execute({
    id,
  }: MotorcycleUseCaseRequest): Promise<MotorcycleUseCaseResponse> {
    const motorcycle = await this.motorcyclesRepository.findById(id)

    if (!motorcycle) {
      throw new ResourceNotFoundError()
    }

    return { motorcycle }
  }
}
