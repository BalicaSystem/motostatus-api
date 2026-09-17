import type { NewMotorcycle } from '../db/schema'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'

export class CreateMotorcycleUseCase {
  constructor(private motorcyclesRepository: MotorcyclesRepository) {}

  async execute({ model, chassis, estimatedArrival }: NewMotorcycle) {
    const motorcycle = await this.motorcyclesRepository.create({
      chassis,
      model,
      estimatedArrival,
    })

    if (!motorcycle) {
      throw new Error('Failed to create motorcycle.')
    }

    return { motorcycle }
  }
}
