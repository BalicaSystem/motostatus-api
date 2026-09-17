import { describe, expect, it } from 'vitest'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { FetchMotorcyclesUseCase } from './fetch-motorcycles'
import { makeMotorcycle } from './factories/make-motorcycles'

describe('Fetch Motorcycles Use Case', () => {
  it('should be able to fetch motorcycles', async () => {
    const motorcyclesRepository = new InMemoryMotorcycleRepository()
    const fetchMotorcycles = new FetchMotorcyclesUseCase(motorcyclesRepository)

    await makeMotorcycle(motorcyclesRepository)
    await makeMotorcycle(motorcyclesRepository)

    const result = await fetchMotorcycles.execute({})

    expect(result.motorcycles).toHaveLength(2)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(20)
    expect(result.total).toBe(2)
    expect(result.totalPages).toBe(1)
  })

  it('should calculate the correct total pages', async () => {
    const motorcyclesRepository = new InMemoryMotorcycleRepository()
    const fetchMotorcycles = new FetchMotorcyclesUseCase(motorcyclesRepository)

    await makeMotorcycle(motorcyclesRepository)
    await makeMotorcycle(motorcyclesRepository)
    await makeMotorcycle(motorcyclesRepository)
    await makeMotorcycle(motorcyclesRepository)
    await makeMotorcycle(motorcyclesRepository)

    const result = await fetchMotorcycles.execute({
      page: 1,
      perPage: 2,
    })

    expect(result.total).toBe(5)
    expect(result.totalPages).toBe(3)
  })

  it('should return an empty list when there are no motorcycles', async () => {
    const motorcyclesRepository = new InMemoryMotorcycleRepository()
    const fetchMotorcycles = new FetchMotorcyclesUseCase(motorcyclesRepository)

    const result = await fetchMotorcycles.execute({})

    expect(result.motorcycles).toHaveLength(0)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(20)
    expect(result.total).toBe(0)
    expect(result.totalPages).toBe(0)
  })
})
