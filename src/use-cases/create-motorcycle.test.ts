import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { CreateMotorcycleUseCase } from './create-motorcycle'

let motorcycleRepository: InMemoryMotorcycleRepository
let sut: CreateMotorcycleUseCase

describe('Create Motorcycle Use Case', () => {
  beforeEach(() => {
    motorcycleRepository = new InMemoryMotorcycleRepository()
    sut = new CreateMotorcycleUseCase(motorcycleRepository)
  })

  it('should be able to create motorcycle', async () => {
    const { motorcycle } = await sut.execute({
      chassis: '9C2JB0100VR207174',
      model: 'POP 110I ES',
      estimatedArrival: '01/08/2026',
    })

    expect(motorcycle.id).toEqual(expect.any(String))
    expect(motorcycle.chassis).toEqual('9C2JB0100VR207174')
  })
})
