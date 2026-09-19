import { beforeEach, describe, expect, it } from 'vitest'
import { type Order } from '../db/schema'
import { InMemoryOrdersRepository } from '../repositories/in-memory/in-memory-orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UpdateOrderUseCase } from './update-order'

describe('Update Order Use Case', () => {
  let ordersRepository: InMemoryOrdersRepository
  let sut: UpdateOrderUseCase
  let order: Order

  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new UpdateOrderUseCase(ordersRepository)

    order = await ordersRepository.create({
      customerId: 'customer-01',
      seller: 'Carlos',
      billingDate: '2026-09-17',
    })
  })

  it('should be able to update an order', async () => {
    const { order: updatedOrder } = await sut.execute({
      id: order.id,
      seller: 'João',
      billingDate: '2026-09-20',
    })

    expect(updatedOrder).toEqual(
      expect.objectContaining({
        id: order.id,
        customerId: 'customer-01',
        seller: 'João',
        billingDate: '2026-09-20',
      }),
    )
  })

  it('should be able to update only the seller', async () => {
    const { order: updatedOrder } = await sut.execute({
      id: order.id,
      seller: 'João',
    })

    expect(updatedOrder).toEqual(
      expect.objectContaining({
        id: order.id,
        seller: 'João',
        billingDate: '2026-09-17',
      }),
    )
  })

  it('should be able to update only the billing date', async () => {
    const { order: updatedOrder } = await sut.execute({
      id: order.id,
      billingDate: '2026-09-20',
    })

    expect(updatedOrder).toEqual(
      expect.objectContaining({
        id: order.id,
        seller: 'Carlos',
        billingDate: '2026-09-20',
      }),
    )
  })

  it('should be able to clear the billing date', async () => {
    const { order: updatedOrder } = await sut.execute({
      id: order.id,
      billingDate: null,
    })

    expect(updatedOrder).toEqual(
      expect.objectContaining({
        id: order.id,
        seller: 'Carlos',
        billingDate: null,
      }),
    )
  })

  it('should not be able to update a non-existing order', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-order',
        seller: 'João',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
