import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
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

describe('Fetch Customer By Id (e2e)', () => {
  let authenticated: Awaited<ReturnType<typeof createAuthedAgent>>

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(orderItems)
    await db.delete(orders)
    await db.delete(customers)
    await db.delete(motorcycles)
    await db.delete(users)

    authenticated = await createAuthedAgent()
  })

  it('should be able to fetch a customer by id', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated.get(`/api/customers/${customer.id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.customer).toEqual(
      expect.objectContaining({
        id: customer.id,
        name: customer.name,
        document: customer.document,
        city: customer.city,
      }),
    )
  })

  it('should not be able to fetch a non-existing customer', async () => {
    const response = await authenticated.get(`/api/customers/${randomUUID()}`)

    expect(response.statusCode).toBe(404)
  })

  it('should not be able to fetch a customer with an invalid id', async () => {
    const response = await authenticated.get('/api/customers/invalid-id')

    expect(response.statusCode).toBe(400)
  })
})
