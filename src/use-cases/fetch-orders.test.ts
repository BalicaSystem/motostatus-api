import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrdersRepository } from '../repositories/in-memory/in-memory-orders-repository'
import { FetchOrdersUseCase } from './fetch-orders'

let ordersRepository: InMemoryOrdersRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new FetchOrdersUseCase(ordersRepository)
  })

  it('should be able to fetch orders', async () => {
    await ordersRepository.create({
      customerId: 'customer-01',
      seller: 'Carlos',
    })

    await ordersRepository.create({
      customerId: 'customer-02',
      seller: 'João',
    })

    const response = await sut.execute({
      page: 1,
      perPage: 10,
    })

    expect(response.orders).toHaveLength(2)
    expect(response.meta).toEqual({
      page: 1,
      perPage: 10,
      total: 2,
      totalPages: 1,
    })
  })

  it('should be able to fetch paginated orders', async () => {
    for (let index = 1; index <= 15; index++) {
      await ordersRepository.create({
        customerId: `customer-${index}`,
        seller: `Seller ${index}`,
      })
    }

    const response = await sut.execute({
      page: 2,
      perPage: 10,
    })

    expect(response.orders).toHaveLength(5)
    expect(response.meta).toEqual({
      page: 2,
      perPage: 10,
      total: 15,
      totalPages: 2,
    })
  })

  it('should return an empty list when there are no orders', async () => {
    const response = await sut.execute({
      page: 1,
      perPage: 10,
    })

    expect(response.orders).toEqual([])
    expect(response.meta).toEqual({
      page: 1,
      perPage: 10,
      total: 0,
      totalPages: 0,
    })
  })

  it('should return the correct total pages', async () => {
    for (let index = 1; index <= 21; index++) {
      await ordersRepository.create({
        customerId: `customer-${index}`,
        seller: `Seller ${index}`,
      })
    }

    const response = await sut.execute({
      page: 1,
      perPage: 10,
    })

    expect(response.meta.totalPages).toEqual(3)
  })
})
