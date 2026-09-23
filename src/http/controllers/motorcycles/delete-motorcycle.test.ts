import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
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
import { createMotorcycle } from '../../../utils/test/create-motorcycle'

describe('Delete Motorcycle (e2e)', () => {
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

  it('should be able to delete a motorcycle', async () => {
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated.delete(
      `/api/motorcycles/${motorcycle?.id}`,
    )

    expect(response.statusCode).toBe(204)

    const [deletedMotorcycle] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, motorcycle?.id))

    expect(deletedMotorcycle).toBeUndefined()
  })

  it('should not be able to delete a non-existing motorcycle', async () => {
    const response = await authenticated.delete(
      `/api/motorcycles/${randomUUID()}`,
    )

    expect(response.statusCode).toBe(404)
  })

  it('should not be able to delete a motorcycle with an invalid id', async () => {
    const response = await authenticated.delete('/api/motorcycles/invalid-id')

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to delete a motorcycle used in order items', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Vendedor Teste',
      })
      .returning()

    await db.insert(orderItems).values({
      orderId: order?.id,
      motorcycleId: motorcycle?.id,
    })

    const response = await authenticated.delete(
      `/api/motorcycles/${motorcycle?.id}`,
    )

    expect(response.statusCode).toBe(409)
  })
})
