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

describe('Update Order (e2e)', () => {
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

  it('should be able to update an order', async () => {
    const { customer } = await createCustomer()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      })
      .returning()

    const response = await authenticated
      .put(`/api/orders/${order?.id}`)
      .send({
        seller: 'João',
        billingDate: '2026-09-20',
      })
      .expect(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order?.id,
        customerId: customer?.id,
        seller: 'João',
        billingDate: '2026-09-20',
      }),
    })
  })

  it('should be able to update only the seller', async () => {
    const { customer } = await createCustomer()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      })
      .returning()

    const response = await authenticated
      .put(`/api/orders/${order.id}`)
      .send({
        seller: 'João',
      })
      .expect(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order?.id,
        customerId: customer?.id,
        seller: 'João',
        billingDate: '2026-09-17',
      }),
    })
  })

  it('should be able to update only the billing date', async () => {
    const { customer } = await createCustomer()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      })
      .returning()

    const response = await authenticated
      .put(`/api/orders/${order?.id}`)
      .send({
        billingDate: '2026-09-20',
      })
      .expect(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order?.id,
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-20',
      }),
    })
  })

  it('should be able to clear the billing date', async () => {
    const { customer } = await createCustomer()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      })
      .returning()

    const response = await authenticated
      .put(`/api/orders/${order?.id}`)
      .send({
        billingDate: null,
      })
      .expect(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order?.id,
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: null,
      }),
    })
  })

  it('should not be able to update a non-existing order', async () => {
    const response = await authenticated
      .put('/api/orders/00000000-0000-0000-0000-000000000000')
      .send({
        seller: 'João',
      })
      .expect(404)

    expect(response.body).toEqual({
      message: 'Resource not found.',
    })
  })

  it('should not be able to update an order with an invalid id', async () => {
    const response = await authenticated
      .put('/api/orders/invalid-id')
      .send({
        seller: 'João',
      })
      .expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })

  it('should not be able to update an order with invalid data', async () => {
    const { customer } = await createCustomer()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
      })
      .returning()

    const response = await authenticated
      .put(`/api/orders/${order?.id}`)
      .send({
        seller: '',
      })
      .expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })
})
