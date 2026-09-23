import { beforeEach, describe, expect, it } from 'vitest'
import type { InjectOptions } from 'light-my-request'
import { app } from '../../../app'
import { db } from '../../../db'
import { orderItems, orders, users } from '../../../db/schema'
import { createCustomer } from '../../../utils/test/create-customer'
import { createMotorcycle } from '../../../utils/test/create-motorcycle'
import { createOrder } from '../../../utils/test/create-order'
import { createUser } from '../../../utils/test/create-user'

describe('Release order item (e2e)', () => {
  let authorization: string

  beforeEach(async () => {
    await db.delete(orderItems)
    await db.delete(orders)
    await db.delete(users)

    const { user } = await createUser()
    authorization = `Bearer ${app.jwt.sign({ sub: user?.id }, { expiresIn: '1h' })}`
  })

  function inject(options: InjectOptions) {
    return app.inject({
      ...options,
      headers: { authorization, ...options.headers },
    })
  }

  it('should release an order item', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const { orderItems: createdOrderItems } = await createOrder({
      customerId: customer?.id,
      motorcycleIds: [motorcycle?.id],
    })

    const orderItem = createdOrderItems[0]

    const response = await inject({
      method: 'POST',
      url: `/api/orders/items/${orderItem?.id}/release`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().orderItem.status).toBe('released')
  })

  it('should not release an order item that is already released', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const { orderItems: createdOrderItems } = await createOrder({
      customerId: customer?.id,
      motorcycleIds: [motorcycle?.id],
    })

    const orderItem = createdOrderItems[0]

    const firstResponse = await inject({
      method: 'POST',
      url: `/api/orders/items/${orderItem?.id}/release`,
    })

    expect(firstResponse.statusCode).toBe(200)

    const secondResponse = await inject({
      method: 'POST',
      url: `/api/orders/items/${orderItem?.id}/release`,
    })

    expect(secondResponse.statusCode).toBe(409)
  })

  it('should return 404 when order item does not exist', async () => {
    const response = await inject({
      method: 'POST',
      url: '/api/orders/items/00000000-0000-0000-0000-000000000000/release',
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when id is invalid', async () => {
    const response = await inject({
      method: 'POST',
      url: '/api/orders/items/invalid/release',
    })

    expect(response.statusCode).toBe(400)
  })
})
