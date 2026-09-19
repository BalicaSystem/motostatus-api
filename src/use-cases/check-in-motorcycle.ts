import type { Motorcycle } from '../db/schema'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import { MotorcycleCannotBeCheckedInError } from './errors/motorcycle-cannot-be-checked-in-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckInMotorcycleUseCaseRequest {
  chassis: string
}

interface CheckInMotorcycleUseCaseResponse {
  motorcycle: Motorcycle
}

export class CheckInMotorcycleUseCase {
  constructor(private motorcyclesRepository: MotorcyclesRepository) {}

  async execute({
    chassis,
  }: CheckInMotorcycleUseCaseRequest): Promise<CheckInMotorcycleUseCaseResponse> {
    const motorcycle = await this.motorcyclesRepository.findByChassis(chassis)

    if (!motorcycle) {
      throw new ResourceNotFoundError()
    }

    if (motorcycle.status !== 'in_transit') {
      throw new MotorcycleCannotBeCheckedInError()
    }

    const updatedMotorcycle = await this.motorcyclesRepository.update(
      motorcycle.id,
      {
        status: 'arrived',
      },
    )

    return {
      motorcycle: updatedMotorcycle,
    }
  }
}