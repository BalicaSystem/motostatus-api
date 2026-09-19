import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrdersRepository } from '../repositories/in-memory/in-memory-orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { DeleteOrderUseCase } from './delete-order'

let ordersRepository: InMemoryOrdersRepository
let sut: DeleteOrderUseCase

describe('Delete Order Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new DeleteOrderUseCase(ordersRepository)
  })

  it('should be able to delete an order', async () => {
    const order = await ordersRepository.create({
      customerId: 'customer-01',
      seller: 'Carlos',
      billingDate: '2026-09-17',
    })

    await sut.execute({
      id: order.id,
    })

    const deletedOrder = await ordersRepository.findById(order.id)

    expect(deletedOrder).toBeNull()
  })

  it('should not be able to delete a non-existing order', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-order',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
