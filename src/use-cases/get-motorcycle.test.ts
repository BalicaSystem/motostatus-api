import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { GetMotorcycleUseCase } from './get-motorcycle'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let motorcyclesRepository: InMemoryMotorcycleRepository
let sut: GetMotorcycleUseCase

describe('Get Motorcycle Use Case', () => {
  beforeEach(() => {
    motorcyclesRepository = new InMemoryMotorcycleRepository()
    sut = new GetMotorcycleUseCase(motorcyclesRepository)
  })

  it('should be able to get motorcycle', async () => {
    const createdMotorcycle = await motorcyclesRepository.create({
      chassis: '9C2JB0100VR207174',
      model: 'POP 110I ES',
      estimatedArrival: '01/08/2026',
      status: 'in_transit',
    })

    const { motorcycle } = await sut.execute({
      id: createdMotorcycle.id,
    })

    expect(motorcycle.id).toEqual(expect.any(String))
    expect(motorcycle.chassis).toEqual('9C2JB0100VR207174')
  })

  it('should not be able to get motorcycle with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
