import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { db } from '../../../db'
import { customers, motorcycles, orderItems, orders } from '../../../db/schema'
import { createCustomer } from '../../../utils/test/create-customer'

describe('Fetch Order By ID (e2e)', () => {
  beforeEach(async () => {
    await app.ready()

    await db.delete(orderItems)
    await db.delete(orders)
    await db.delete(customers)
    await db.delete(motorcycles)
  })

  it('should be able to fetch an order by id', async () => {
    const { customer } = await createCustomer()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      })
      .returning()

    const response = await request(app.server)
      .get(`/api/orders/${order?.id}`)
      .expect(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order?.id,
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      }),
    })
  })

  it('should not be able to fetch a non-existing order', async () => {
    const response = await request(app.server)
      .get('/api/orders/00000000-0000-0000-0000-000000000000')
      .expect(404)

    expect(response.body).toEqual({
      message: 'Resource not found.',
    })
  })

  it('should not be able to fetch an order with an invalid id', async () => {
    const response = await request(app.server)
      .get('/api/orders/invalid-id')
      .expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })
})
