import { describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UpdateMotorcycleUseCase } from './update-motorcycle'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'

describe('Update Motorcycle Use Case', () => {
  it('should be able to update a motorcycle', async () => {
    const motorcyclesRepository = new InMemoryMotorcycleRepository()
    const updateMotorcycle = new UpdateMotorcycleUseCase(motorcyclesRepository)

    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: 'TEST-123',
      estimatedArrival: '2026-09-25',
      status: 'in_transit',
    })

    const { motorcycle: updatedMotorcycle } = await updateMotorcycle.execute({
      id: motorcycle.id,
      model: 'CG 160 Titan',
      estimatedArrival: '2026-10-01',
      status: 'arrived',
    })

    expect(updatedMotorcycle).toEqual(
      expect.objectContaining({
        id: motorcycle.id,
        model: 'CG 160 Titan',
        chassis: 'TEST-123',
        estimatedArrival: '2026-10-01',
        status: 'arrived',
      }),
    )
  })

  it('should not be able to update a non-existing motorcycle', async () => {
    const motorcyclesRepository = new InMemoryMotorcycleRepository()
    const updateMotorcycle = new UpdateMotorcycleUseCase(motorcyclesRepository)

    await expect(
      updateMotorcycle.execute({
        id: 'non-existing-id',
        model: 'CG 160 Titan',
        estimatedArrival: '2026-10-01',
        status: 'arrived',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
