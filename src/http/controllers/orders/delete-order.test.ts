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

describe('Delete Order (e2e)', () => {
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

  it('should be able to delete an order', async () => {
    const { customer } = await createCustomer()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
        billingDate: '2026-09-17',
      })
      .returning()

    await authenticated.delete(`/api/orders/${order?.id}`).expect(204)

    const response = await authenticated
      .get(`/api/orders/${order?.id}`)
      .expect(404)

    expect(response.body).toEqual({
      message: 'Resource not found.',
    })
  })

  it('should not be able to delete a non-existing order', async () => {
    const response = await authenticated
      .delete('/api/orders/00000000-0000-0000-0000-000000000000')
      .expect(404)

    expect(response.body).toEqual({
      message: 'Resource not found.',
    })
  })

  it('should not be able to delete an order with an invalid id', async () => {
    const response = await authenticated
      .delete('/api/orders/invalid-id')
      .expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })
})
