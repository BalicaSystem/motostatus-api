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

describe('Fetch Order By ID (e2e)', () => {
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

  it('should be able to fetch an order by id', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      })
      .returning()

    const [orderItem] = await db
      .insert(orderItems)
      .values({
        orderId: order?.id,
        motorcycleId: motorcycle?.id,
      })
      .returning()

    const response = await authenticated
      .get(`/api/orders/${order?.id}`)
      .expect(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order?.id,
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      }),
      orderItems: [
        expect.objectContaining({
          id: orderItem?.id,
          orderId: order?.id,
          motorcycleId: motorcycle?.id,
          registrationStatus: 'without_registration',
          registrationDate: null,
        }),
      ],
    })
  })

  it('should be able to fetch an order without order items', async () => {
    const { customer } = await createCustomer()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
      })
      .returning()

    const response = await authenticated
      .get(`/api/orders/${order?.id}`)
      .expect(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order?.id,
        customerId: customer?.id,
        seller: 'Carlos',
      }),
      orderItems: [],
    })
  })

  it('should not be able to fetch a non-existing order', async () => {
    const response = await authenticated
      .get('/api/orders/00000000-0000-0000-0000-000000000000')
      .expect(404)

    expect(response.body).toEqual({
      message: 'Resource not found.',
    })
  })

  it('should not be able to fetch an order with an invalid id', async () => {
    const response = await authenticated
      .get('/api/orders/invalid-id')
      .expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })
})
