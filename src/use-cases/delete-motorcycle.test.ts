import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { InMemoryOrderItemsRepository } from '../repositories/in-memory/in-memory-order-items-repository'
import { DeleteMotorcycleUseCase } from './delete-motorcycle'
import { MotorcycleHasOrderItemsError } from './errors/motorcycle-has-order-items-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let motorcyclesRepository: InMemoryMotorcycleRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: DeleteMotorcycleUseCase

describe('Delete Motorcycle Use Case', () => {
  beforeEach(() => {
    motorcyclesRepository = new InMemoryMotorcycleRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()
    sut = new DeleteMotorcycleUseCase(
      motorcyclesRepository,
      orderItemsRepository,
    )
  })

  it('should be able to delete a motorcycle', async () => {
    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: `TEST-${randomUUID()}`,
      estimatedArrival: '2026-09-25',
    })

    await sut.execute({
      id: motorcycle.id,
    })

    const deletedMotorcycle = await motorcyclesRepository.findById(
      motorcycle.id,
    )

    expect(deletedMotorcycle).toBeNull()
  })

  it('should not be able to delete a non-existing motorcycle', async () => {
    await expect(
      sut.execute({
        id: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a motorcycle used in order items', async () => {
    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: `TEST-${randomUUID()}`,
      estimatedArrival: '2026-09-25',
    })

    await orderItemsRepository.create({
      orderId: randomUUID(),
      motorcycleId: motorcycle.id,
    })

    await expect(
      sut.execute({
        id: motorcycle.id,
      }),
    ).rejects.toBeInstanceOf(MotorcycleHasOrderItemsError)
  })
})
