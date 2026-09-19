import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { db } from '../../../db'
import { customers, motorcycles, orderItems, orders } from '../../../db/schema'
import { eq } from 'drizzle-orm'

describe('Reassign motorcycle', () => {
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
  })

  it('should allow a released motorcycle to be reassigned to another customer', async () => {
    const [customerA] = await db
      .insert(customers)
      .values({
        id: randomUUID(),
        name: 'João Silva',
        document: `${Date.now()}01`,
        city: 'Fortaleza',
      })
      .returning()

    const [customerB] = await db
      .insert(customers)
      .values({
        id: randomUUID(),
        name: 'Maria Silva',
        document: `${Date.now()}02`,
        city: 'Fortaleza',
      })
      .returning()

    const [motorcycle] = await db
      .insert(motorcycles)
      .values({
        id: randomUUID(),
        model: 'Honda CG 160',
        chassis: `${Date.now()}CHASSIS`,
        status: 'arrived',
      })
      .returning()

    const firstOrderResponse = await app.inject({
      method: 'POST',
      url: '/api/orders',
      payload: {
        customerId: customerA?.id,
        seller: 'João Vendedor',
        motorcycleIds: [motorcycle?.id],
      },
    })

    expect(firstOrderResponse.statusCode).toEqual(201)

    const firstOrderBody = firstOrderResponse.json()

    const firstOrderItem = firstOrderBody.orderItems[0]

    const releaseResponse = await app.inject({
      method: 'POST',
      url: `/api/orders/items/${firstOrderItem.id}/release`,
    })

    expect(releaseResponse.statusCode).toEqual(200)
    expect(releaseResponse.json().orderItem.status).toEqual('released')

    const secondOrderResponse = await app.inject({
      method: 'POST',
      url: '/api/orders',
      payload: {
        customerId: customerB?.id,
        seller: 'Maria Vendedora',
        motorcycleIds: [motorcycle?.id],
      },
    })

    expect(secondOrderResponse.statusCode).toEqual(201)

    const secondOrderBody = secondOrderResponse.json()

    expect(secondOrderBody.order.customerId).toEqual(customerB?.id)
    expect(secondOrderBody.orderItems).toHaveLength(1)
    expect(secondOrderBody.orderItems[0].motorcycleId).toEqual(motorcycle?.id)
    expect(secondOrderBody.orderItems[0].status).toEqual('active')

    const motorcycleOrderItems = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.motorcycleId, motorcycle?.id))

    expect(motorcycleOrderItems).toHaveLength(2)

    expect(
      motorcycleOrderItems.some((orderItem) => orderItem.status === 'released'),
    ).toBe(true)

    expect(
      motorcycleOrderItems.some((orderItem) => orderItem.status === 'active'),
    ).toBe(true)
  })
})
