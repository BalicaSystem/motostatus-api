import type { Motorcycle } from '../db/schema'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import { ChassisAlreadyExistsError } from './errors/chassis-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateMotorcycleUseCaseRequest {
  id: string
  model?: string
  chassis?: string
  estimatedArrival?: string | null
  status?: Motorcycle['status']
}

interface UpdateMotorcycleUseCaseResponse {
  motorcycle: Motorcycle
}

export class UpdateMotorcycleUseCase {
  constructor(private motorcyclesRepository: MotorcyclesRepository) {}

  async execute({
    id,
    model,
    chassis,
    estimatedArrival,
    status,
  }: UpdateMotorcycleUseCaseRequest): Promise<UpdateMotorcycleUseCaseResponse> {
    const motorcycle = await this.motorcyclesRepository.findById(id)

    if (!motorcycle) {
      throw new ResourceNotFoundError()
    }

    if (chassis && chassis !== motorcycle.chassis) {
      const motorcycleWithSameChassis =
        await this.motorcyclesRepository.findByChassis(chassis)

      if (
        motorcycleWithSameChassis &&
        motorcycleWithSameChassis.id !== motorcycle.id
      ) {
        throw new ChassisAlreadyExistsError()
      }
    }

    const updatedMotorcycle = await this.motorcyclesRepository.update(id, {
      ...(model !== undefined && { model }),
      ...(chassis !== undefined && { chassis }),
      ...(estimatedArrival !== undefined && { estimatedArrival }),
      ...(status !== undefined && { status }),
    })

    return {
      motorcycle: updatedMotorcycle,
    }
  }
}
