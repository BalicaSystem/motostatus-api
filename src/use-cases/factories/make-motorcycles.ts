import { randomUUID } from 'node:crypto'
import type { NewMotorcycle } from '../../db/schema'
import type { InMemoryMotorcycleRepository } from '../../repositories/in-memory/in-memory-motorcycle-repository'

export async function makeMotorcycle(
  repository: InMemoryMotorcycleRepository,
  data: Partial<NewMotorcycle> = {},
) {
  return repository.create({
    model: 'CG 160 Fan',
    chassis: `TEST-${randomUUID()}`,
    estimatedArrival: '2026-09-25',
    status: 'in_transit',
    ...data,
  })
}
