import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrderItemsRepository } from '../repositories/in-memory/in-memory-order-items-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UpdateOrderItemUseCase } from './update-order-item'

let orderItemsRepository: InMemoryOrderItemsRepository
let sut: UpdateOrderItemUseCase

describe('Update Order Item Use Case', () => {
  beforeEach(() => {
    orderItemsRepository = new InMemoryOrderItemsRepository()

    sut = new UpdateOrderItemUseCase(orderItemsRepository)
  })

  it('should be able to update an order item', async () => {
    const orderItem = await orderItemsRepository.create({
      orderId: 'order-01',
      motorcycleId: 'motorcycle-01',
    })

    const response = await sut.execute({
      id: orderItem.id,
      registrationStatus: 'registered',
      registrationDate: '2026-09-17',
    })

    expect(response.orderItem).toEqual(
      expect.objectContaining({
        id: orderItem.id,
        registrationStatus: 'registered',
        registrationDate: '2026-09-17',
      }),
    )
  })

  it('should be able to update only the registration status', async () => {
    const orderItem = await orderItemsRepository.create({
      orderId: 'order-01',
      motorcycleId: 'motorcycle-01',
      registrationDate: '2026-09-10',
    })

    const response = await sut.execute({
      id: orderItem.id,
      registrationStatus: 'registering',
    })

    expect(response.orderItem.registrationStatus).toEqual('registering')
    expect(response.orderItem.registrationDate).toEqual('2026-09-10')
  })

  it('should be able to update only the registration date', async () => {
    const orderItem = await orderItemsRepository.create({
      orderId: 'order-01',
      motorcycleId: 'motorcycle-01',
    })

    const response = await sut.execute({
      id: orderItem.id,
      registrationDate: '2026-09-17',
    })

    expect(response.orderItem.registrationStatus).toEqual(
      'without_registration',
    )
    expect(response.orderItem.registrationDate).toEqual('2026-09-17')
  })

  it('should be able to clear the registration date', async () => {
    const orderItem = await orderItemsRepository.create({
      orderId: 'order-01',
      motorcycleId: 'motorcycle-01',
      registrationStatus: 'registered',
      registrationDate: '2026-09-17',
    })

    const response = await sut.execute({
      id: orderItem.id,
      registrationDate: null,
    })

    expect(response.orderItem.registrationDate).toBeNull()
  })

  it('should not be able to update a non-existing order item', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-order-item',
        registrationStatus: 'registered',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
