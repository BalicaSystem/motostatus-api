import type { NewMotorcycle } from '../db/schema'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'

export class CreateMotorcycleUseCase {
  constructor(private motorcyclesRepository: MotorcyclesRepository) {}

  async execute({ model, chassis, estimatedArrival, status }: NewMotorcycle) {
    const motorcycle = await this.motorcyclesRepository.create({
      chassis,
      model,
      status,
      estimatedArrival,
    })

    return { motorcycle }
  }
}
