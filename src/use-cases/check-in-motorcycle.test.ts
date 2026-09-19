import { describe, expect, it } from 'vitest'
import { beforeEach } from 'vitest'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { CheckInMotorcycleUseCase } from './check-in-motorcycle'
import { MotorcycleCannotBeCheckedInError } from './errors/motorcycle-cannot-be-checked-in-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let motorcyclesRepository: InMemoryMotorcycleRepository
let sut: CheckInMotorcycleUseCase

describe('Check In Motorcycle Use Case', () => {
  beforeEach(() => {
    motorcyclesRepository = new InMemoryMotorcycleRepository()
    sut = new CheckInMotorcycleUseCase(motorcyclesRepository)
  })

  it('should be able to check in a motorcycle', async () => {
    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: '9C2KC0810GR123456',
      estimatedArrival: '2026-09-25',
      status: 'in_transit',
    })

    const { motorcycle: updatedMotorcycle } = await sut.execute({
      chassis: motorcycle.chassis,
    })

    expect(updatedMotorcycle).toEqual(
      expect.objectContaining({
        id: motorcycle.id,
        model: 'CG 160 Fan',
        chassis: '9C2KC0810GR123456',
        status: 'arrived',
      }),
    )
  })

  it('should not be able to check in a non-existing motorcycle', async () => {
    await expect(
      sut.execute({
        chassis: 'non-existing-chassis',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to check in a motorcycle with status arrived', async () => {
    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: '9C2KC0810GR123456',
      status: 'arrived',
    })

    await expect(
      sut.execute({
        chassis: motorcycle.chassis,
      }),
    ).rejects.toBeInstanceOf(MotorcycleCannotBeCheckedInError)
  })

  it('should not be able to check in a motorcycle with status delayed', async () => {
    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: '9C2KC0810GR123456',
      status: 'delayed',
    })

    await expect(
      sut.execute({
        chassis: motorcycle.chassis,
      }),
    ).rejects.toBeInstanceOf(MotorcycleCannotBeCheckedInError)
  })
})