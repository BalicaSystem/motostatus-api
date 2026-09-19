import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { MarkDelayedMotorcyclesUseCase } from './mark-delayed-motorcycles'
import { makeMotorcycle } from './factories/make-motorcycles'

let motorcyclesRepository: InMemoryMotorcycleRepository
let sut: MarkDelayedMotorcyclesUseCase

describe('Mark Delayed Motorcycles Use Case', () => {
  beforeEach(() => {
    motorcyclesRepository = new InMemoryMotorcycleRepository()
    sut = new MarkDelayedMotorcyclesUseCase(motorcyclesRepository)
  })

  it('should mark overdue in transit motorcycles as delayed', async () => {
    await makeMotorcycle(motorcyclesRepository, {
      chassis: '9C2KC0810GR123456',
      estimatedArrival: '2026-09-21',
      status: 'in_transit',
    })

    const { count } = await sut.execute({ referenceDate: '2026-09-22' })

    expect(count).toBe(1)
    expect(motorcyclesRepository.items[0]).toEqual(
      expect.objectContaining({
        chassis: '9C2KC0810GR123456',
        status: 'delayed',
      }),
    )
  })

  it('should not mark a motorcycle whose arrival is the reference date', async () => {
    await makeMotorcycle(motorcyclesRepository, {
      chassis: '9C2KC0810GR123456',
      estimatedArrival: '2026-09-22',
      status: 'in_transit',
    })

    const { count } = await sut.execute({ referenceDate: '2026-09-22' })

    expect(count).toBe(0)
    expect(motorcyclesRepository.items[0]).toEqual(
      expect.objectContaining({ status: 'in_transit' }),
    )
  })

  it('should not mark a motorcycle with a future arrival date', async () => {
    await makeMotorcycle(motorcyclesRepository, {
      chassis: '9C2KC0810GR123456',
      estimatedArrival: '2026-09-25',
      status: 'in_transit',
    })

    const { count } = await sut.execute({ referenceDate: '2026-09-22' })

    expect(count).toBe(0)
    expect(motorcyclesRepository.items[0]).toEqual(
      expect.objectContaining({ status: 'in_transit' }),
    )
  })

  it('should not mark arrived motorcycles', async () => {
    await makeMotorcycle(motorcyclesRepository, {
      chassis: '9C2KC0810GR123456',
      estimatedArrival: '2026-09-20',
      status: 'arrived',
    })

    const { count } = await sut.execute({ referenceDate: '2026-09-22' })

    expect(count).toBe(0)
    expect(motorcyclesRepository.items[0]).toEqual(
      expect.objectContaining({ status: 'arrived' }),
    )
  })

  it('should not mark already delayed motorcycles', async () => {
    await makeMotorcycle(motorcyclesRepository, {
      chassis: '9C2KC0810GR123456',
      estimatedArrival: '2026-09-19',
      status: 'delayed',
    })

    const { count } = await sut.execute({ referenceDate: '2026-09-22' })

    expect(count).toBe(0)
    expect(motorcyclesRepository.items[0]).toEqual(
      expect.objectContaining({ status: 'delayed' }),
    )
  })

  it('should ignore motorcycles without an estimated arrival', async () => {
    await makeMotorcycle(motorcyclesRepository, {
      chassis: '9C2KC0810GR123456',
      estimatedArrival: null,
      status: 'in_transit',
    })

    const { count } = await sut.execute({ referenceDate: '2026-09-22' })

    expect(count).toBe(0)
    expect(motorcyclesRepository.items[0]).toEqual(
      expect.objectContaining({ status: 'in_transit' }),
    )
  })

  it('should use today in Fortaleza when no reference date is provided', async () => {
    await makeMotorcycle(motorcyclesRepository, {
      chassis: '9C2KC0810GR123456',
      estimatedArrival: '2000-01-01',
      status: 'in_transit',
    })

    const { count } = await sut.execute()

    expect(count).toBe(1)
  })
})