import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db'
import { orderItems, orders } from '../../../db/schema'
import { createCustomer } from '../../../utils/test/create-customer'
import { createMotorcycle } from '../../../utils/test/create-motorcycle'
import { createOrder } from '../../../utils/test/create-order'
import { app } from '../../../app'

describe('Complete order item (e2e)', () => {
  beforeEach(async () => {
    await db.delete(orderItems)
    await db.delete(orders)
  })

  it('should complete an order item', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const { orderItems: createdOrderItems } = await createOrder({
      customerId: customer?.id,
      motorcycleIds: [motorcycle?.id],
    })

    const orderItem = createdOrderItems[0]

    const response = await app.inject({
      method: 'POST',
      url: `/api/orders/items/${orderItem?.id}/complete`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().orderItem.status).toBe('completed')
  })

  it('should not complete an order item that is already completed', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const { orderItems: createdOrderItems } = await createOrder({
      customerId: customer?.id,
      motorcycleIds: [motorcycle?.id],
    })

    const orderItem = createdOrderItems[0]

    const firstResponse = await app.inject({
      method: 'POST',
      url: `/api/orders/items/${orderItem?.id}/complete`,
    })

    expect(firstResponse.statusCode).toBe(200)

    const secondResponse = await app.inject({
      method: 'POST',
      url: `/api/orders/items/${orderItem?.id}/complete`,
    })

    expect(secondResponse.statusCode).toBe(409)
  })

  it('should not complete an order item that is released', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const { orderItems: createdOrderItems } = await createOrder({
      customerId: customer?.id,
      motorcycleIds: [motorcycle?.id],
    })

    const orderItem = createdOrderItems[0]

    const releaseResponse = await app.inject({
      method: 'POST',
      url: `/api/orders/items/${orderItem?.id}/release`,
    })

    expect(releaseResponse.statusCode).toBe(200)

    const completeResponse = await app.inject({
      method: 'POST',
      url: `/api/orders/items/${orderItem?.id}/complete`,
    })

    expect(completeResponse.statusCode).toBe(409)
  })

  it('should return 404 when order item does not exist', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/orders/items/00000000-0000-0000-0000-000000000000/complete',
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when id is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/orders/items/invalid/complete',
    })

    expect(response.statusCode).toBe(400)
  })
})
