import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'
import { getTodayInBrazil } from '../utils/date'

interface MarkDelayedMotorcyclesUseCaseRequest {
  referenceDate?: string
}

interface MarkDelayedMotorcyclesUseCaseResponse {
  count: number
}

export class MarkDelayedMotorcyclesUseCase {
  constructor(private motorcyclesRepository: MotorcyclesRepository) {}

  async execute({
    referenceDate,
  }: MarkDelayedMotorcyclesUseCaseRequest = {}): Promise<MarkDelayedMotorcyclesUseCaseResponse> {
    const overdueMotorcycles =
      await this.motorcyclesRepository.findOverdueInTransit(
        referenceDate ?? getTodayInBrazil(),
      )

    for (const motorcycle of overdueMotorcycles) {
      await this.motorcyclesRepository.update(motorcycle.id, {
        status: 'delayed',
      })
    }

    return {
      count: overdueMotorcycles.length,
    }
  }
}