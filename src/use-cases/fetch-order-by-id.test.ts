import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCustomersRepository } from '../repositories/in-memory/in-memory-customers-repository'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { InMemoryOrderItemsRepository } from '../repositories/in-memory/in-memory-order-items-repository'
import { InMemoryOrdersRepository } from '../repositories/in-memory/in-memory-orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchOrderByIdUseCase } from './fetch-order-by-id'

let ordersRepository: InMemoryOrdersRepository
let customersRepository: InMemoryCustomersRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let motorcyclesRepository: InMemoryMotorcycleRepository
let sut: FetchOrderByIdUseCase

describe('Fetch Order By ID Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    customersRepository = new InMemoryCustomersRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()
    motorcyclesRepository = new InMemoryMotorcycleRepository()

    sut = new FetchOrderByIdUseCase(
      ordersRepository,
      customersRepository,
      orderItemsRepository,
      motorcyclesRepository,
    )
  })

  it('should be able to fetch an order by id', async () => {
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

    const orderItem = await orderItemsRepository.create({
      orderId: order.id,
      motorcycleId: motorcycle.id,
    })

    const response = await sut.execute({
      id: order.id,
    })

    expect(response.order).toEqual({
      ...order,
      customer,
    })

    expect(response.orderItems).toEqual([
      {
        ...orderItem,
        motorcycle,
      },
    ])
  })

  it('should not be able to fetch a non-existing order', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-order',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
