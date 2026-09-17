import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrderItemsRepository } from '../repositories/in-memory/in-memory-order-items-repository'
import { InMemoryOrdersRepository } from '../repositories/in-memory/in-memory-orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchOrderByIdUseCase } from './fetch-order-by-id'

let ordersRepository: InMemoryOrdersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let sut: FetchOrderByIdUseCase

describe('Fetch Order By ID Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()

    sut = new FetchOrderByIdUseCase(ordersRepository, orderItemsRepository)
  })

  it('should be able to fetch an order by id', async () => {
    const order = await ordersRepository.create({
      customerId: 'customer-01',
      seller: 'Carlos',
      billingDate: '2026-09-17',
    })

    const orderItem = await orderItemsRepository.create({
      orderId: order.id,
      motorcycleId: 'motorcycle-01',
    })

    const response = await sut.execute({
      id: order.id,
    })

    expect(response.order).toEqual(order)
    expect(response.orderItems).toEqual([orderItem])
  })

  it('should not be able to fetch a non-existing order', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-order',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
