import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrdersRepository } from '../repositories/in-memory/in-memory-orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchOrderByIdUseCase } from './fetch-order-by-id'

let ordersRepository: InMemoryOrdersRepository
let sut: FetchOrderByIdUseCase

describe('Fetch Order By ID Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new FetchOrderByIdUseCase(ordersRepository)
  })

  it('should be able to fetch an order by id', async () => {
    const order = await ordersRepository.create({
      customerId: 'customer-01',
      seller: 'Carlos',
    })

    const response = await sut.execute({
      id: order.id,
    })

    expect(response.order).toEqual(order)
  })

  it('should not be able to fetch a non-existing order', async () => {
    await expect(
      sut.execute({
        id: '00000000-0000-0000-0000-000000000000',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
