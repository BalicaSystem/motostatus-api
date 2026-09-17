import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCustomersRepository } from '../repositories/in-memory/in-memory-customers-repository'
import { InMemoryMotorcycleRepository } from '../repositories/in-memory/in-memory-motorcycle-repository'
import { InMemoryOrderItemsRepository } from '../repositories/in-memory/in-memory-order-items-repository'
import { InMemoryOrdersRepository } from '../repositories/in-memory/in-memory-orders-repository'
import { MotorcycleUnavailableError } from './errors/motorcycle-unavailable-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CreateOrderUseCase } from './create-order'

let customersRepository: InMemoryCustomersRepository
let motorcyclesRepository: InMemoryMotorcycleRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let ordersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    motorcyclesRepository = new InMemoryMotorcycleRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()
    ordersRepository = new InMemoryOrdersRepository()

    sut = new CreateOrderUseCase(
      ordersRepository,
      orderItemsRepository,
      customersRepository,
      motorcyclesRepository,
    )
  })

  it('should be able to create an order', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: 'TEST-123',
      estimatedArrival: '2026-09-25',
      status: 'arrived',
    })

    const response = await sut.execute({
      customerId: customer.id,
      seller: 'Carlos',
      billingDate: '2026-09-17',
      motorcycleIds: [motorcycle.id],
    })

    expect(response.order).toEqual(
      expect.objectContaining({
        customerId: customer.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      }),
    )

    expect(response.orderItems).toHaveLength(1)

    expect(response.orderItems[0]).toEqual(
      expect.objectContaining({
        orderId: response.order.id,
        motorcycleId: motorcycle.id,
        registrationStatus: 'without_registration',
        registrationDate: null,
      }),
    )
  })

  it('should be able to create an order without billing date', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: 'TEST-123',
      estimatedArrival: '2026-09-25',
      status: 'arrived',
    })

    const response = await sut.execute({
      customerId: customer.id,
      seller: 'Carlos',
      motorcycleIds: [motorcycle.id],
    })

    expect(response.order).toEqual(
      expect.objectContaining({
        customerId: customer.id,
        seller: 'Carlos',
        billingDate: null,
      }),
    )
  })

  it('should be able to create an order with multiple motorcycles', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const motorcycle1 = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: 'TEST-123',
      estimatedArrival: '2026-09-25',
      status: 'arrived',
    })

    const motorcycle2 = await motorcyclesRepository.create({
      model: 'CG 160 Titan',
      chassis: 'TEST-456',
      estimatedArrival: '2026-09-26',
      status: 'arrived',
    })

    const response = await sut.execute({
      customerId: customer.id,
      seller: 'Carlos',
      motorcycleIds: [motorcycle1.id, motorcycle2.id],
    })

    expect(response.orderItems).toHaveLength(2)

    expect(response.orderItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          motorcycleId: motorcycle1.id,
        }),
        expect.objectContaining({
          motorcycleId: motorcycle2.id,
        }),
      ]),
    )
  })

  it('should not be able to create an order with a non-existing customer', async () => {
    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: 'TEST-123',
      estimatedArrival: '2026-09-25',
      status: 'arrived',
    })

    await expect(
      sut.execute({
        customerId: '00000000-0000-0000-0000-000000000000',
        seller: 'Carlos',
        motorcycleIds: [motorcycle.id],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create an order with a non-existing motorcycle', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    await expect(
      sut.execute({
        customerId: customer.id,
        seller: 'Carlos',
        motorcycleIds: ['00000000-0000-0000-0000-000000000000'],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add the same motorcycle twice', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const motorcycle = await motorcyclesRepository.create({
      model: 'CG 160 Fan',
      chassis: 'TEST-123',
      estimatedArrival: '2026-09-25',
      status: 'arrived',
    })

    await expect(
      sut.execute({
        customerId: customer.id,
        seller: 'Carlos',
        motorcycleIds: [motorcycle.id, motorcycle.id],
      }),
    ).rejects.toBeInstanceOf(MotorcycleUnavailableError)
  })
})
