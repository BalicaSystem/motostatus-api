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
import { eq } from 'drizzle-orm'

describe('Delete Customer (e2e)', () => {
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

  it('should be able to delete a customer', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated.delete(
      `/api/customers/${customer?.id}`,
    )

    expect(response.statusCode).toBe(204)

    const [deletedCustomer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customer?.id))

    expect(deletedCustomer).toBeUndefined()
  })

  it('should not be able to delete a non-existing customer', async () => {
    const response = await authenticated.delete(
      `/api/customers/${randomUUID()}`,
    )

    expect(response.statusCode).toBe(404)
  })

  it('should not be able to delete a customer with an invalid id', async () => {
    const response = await authenticated.delete('/api/customers/invalid-id')

    expect(response.statusCode).toBe(400)
  })
})
