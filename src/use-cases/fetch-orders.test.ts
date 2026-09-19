import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCustomersRepository } from '../repositories/in-memory/in-memory-customers-repository'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { InMemoryOrderItemsRepository } from '../repositories/in-memory/in-memory-order-items-repository'
import { InMemoryOrdersRepository } from '../repositories/in-memory/in-memory-orders-repository'
import { FetchOrdersUseCase } from './fetch-orders'

let ordersRepository: InMemoryOrdersRepository
let customersRepository: InMemoryCustomersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let motorcyclesRepository: InMemoryMotorcycleRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    customersRepository = new InMemoryCustomersRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()
    motorcyclesRepository = new InMemoryMotorcycleRepository()

    sut = new FetchOrdersUseCase(
      ordersRepository,
      customersRepository,
      orderItemsRepository,
      motorcyclesRepository,
    )
  })

  it('should be able to fetch orders', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const motorcycle = await motorcyclesRepository.create({
      model: 'Honda CG 160 Fan',
      chassis: '9C2KC0810SR123456',
      estimatedArrival: '2026-09-25',
      status: 'arrived',
    })

    const order = await ordersRepository.create({
      customerId: customer.id,
      seller: 'Carlos',
      billingDate: '2026-09-17',
    })

    await orderItemsRepository.create({
      orderId: order.id,
      motorcycleId: motorcycle.id,
    })

    const response = await sut.execute({
      page: 1,
      perPage: 10,
    })

    expect(response.orders).toEqual([
      {
        id: order.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
        createdAt: order.createdAt,
        customer: {
          id: customer.id,
          name: 'João Silva',
          document: '12345678900',
        },
        motorcycles: [
          {
            id: motorcycle.id,
            model: 'Honda CG 160 Fan',
            chassis: '9C2KC0810SR123456',
          },
        ],
      },
    ])

    expect(response.meta).toEqual({
      page: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
    })
  })

  it('should be able to fetch paginated orders', async () => {
    for (let index = 1; index <= 15; index++) {
      const customer = await customersRepository.create({
        name: `Customer ${index}`,
        document: `1234567890${index}`,
        city: 'Sobral',
      })

      await ordersRepository.create({
        customerId: customer.id,
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
      const customer = await customersRepository.create({
        name: `Customer ${index}`,
        document: `1234567890${index}`,
        city: 'Sobral',
      })

      await ordersRepository.create({
        customerId: customer.id,
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
