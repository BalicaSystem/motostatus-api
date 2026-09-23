import { beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { db } from '../../../db'
import {
  customers,
  motorcycles,
  orderItems,
  orders,
  users,
} from '../../../db/schema'
import { createAuthedAgent } from '../../../utils/test/authed-agent'
import { createCustomer } from '../../../utils/test/create-customer'
import { createMotorcycle } from '../../../utils/test/create-motorcycle'

describe('Create Order (e2e)', () => {
  let authenticated: Awaited<ReturnType<typeof createAuthedAgent>>

  beforeEach(async () => {
    await app.ready()

    await db.delete(orderItems)
    await db.delete(orders)
    await db.delete(customers)
    await db.delete(motorcycles)
    await db.delete(users)

    authenticated = await createAuthedAgent()
  })

  it('should be able to create an order', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated.post('/api/orders').send({
      customerId: customer?.id,
      seller: 'Carlos',
      billingDate: '2026-09-17',
      motorcycleIds: [motorcycle?.id],
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: expect.any(String),
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      }),
      orderItems: [
        expect.objectContaining({
          id: expect.any(String),
          orderId: expect.any(String),
          motorcycleId: motorcycle?.id,
          registrationStatus: 'without_registration',
          registrationDate: null,
        }),
      ],
    })
  })

  it('should be able to create an order with multiple motorcycles', async () => {
    const { customer } = await createCustomer()
    const { motorcycle: motorcycle1 } = await createMotorcycle({
      chassis: 'TEST-001',
    })
    const { motorcycle: motorcycle2 } = await createMotorcycle({
      chassis: 'TEST-002',
    })

    const response = await authenticated.post('/api/orders').send({
      customerId: customer?.id,
      seller: 'Carlos',
      motorcycleIds: [motorcycle1?.id, motorcycle2?.id],
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body.orderItems).toHaveLength(2)

    expect(response.body.orderItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          motorcycleId: motorcycle1?.id,
        }),
        expect.objectContaining({
          motorcycleId: motorcycle2?.id,
        }),
      ]),
    )
  })

  it('should not be able to create an order with a non-existing customer', async () => {
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated.post('/api/orders').send({
      customerId: '00000000-0000-0000-0000-000000000000',
      seller: 'Carlos',
      motorcycleIds: [motorcycle?.id],
    })

    expect(response.statusCode).toEqual(404)
  })

  it('should not be able to create an order with a non-existing motorcycle', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated.post('/api/orders').send({
      customerId: customer?.id,
      seller: 'Carlos',
      motorcycleIds: ['00000000-0000-0000-0000-000000000000'],
    })

    expect(response.statusCode).toEqual(404)
  })

  it('should not be able to add the same motorcycle twice', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated.post('/api/orders').send({
      customerId: customer?.id,
      seller: 'Carlos',
      motorcycleIds: [motorcycle?.id, motorcycle?.id],
    })

    expect(response.statusCode).toEqual(409)
  })

  it('should not be able to create an order with invalid data', async () => {
    const response = await authenticated.post('/api/orders').send({
      customerId: 'invalid-id',
      seller: '',
      motorcycleIds: [],
    })

    expect(response.statusCode).toEqual(400)
  })
})
