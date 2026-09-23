import type { Motorcycle } from '../db/schema'
import type { MotorcyclesRepository } from '../repositories/motorcycles-repository'

interface FetchMotorcyclesUseCaseRequest {
  page?: number
  perPage?: number
  search?: string
  status?: Motorcycle['status']
}

interface FetchMotorcyclesUseCaseResponse {
  motorcycles: Motorcycle[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export class FetchMotorcyclesUseCase {
  constructor(private motorcyclesRepository: MotorcyclesRepository) {}

  async execute({
    page = 1,
    perPage = 20,
    search,
    status,
  }: FetchMotorcyclesUseCaseRequest): Promise<FetchMotorcyclesUseCaseResponse> {
    const offset = (page - 1) * perPage

    const [motorcycles, total] = await Promise.all([
      this.motorcyclesRepository.findMany({
        limit: perPage,
        offset,
        search,
        status,
      }),
      this.motorcyclesRepository.count({ search, status }),
    ])

    return {
      motorcycles,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    }
  }
}
