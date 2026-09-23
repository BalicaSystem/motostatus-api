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

describe('Update Order Item (e2e)', () => {
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

  it('should be able to update an order item', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
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
      .put(`/api/orders/items/${orderItem?.id}`)
      .send({
        registrationStatus: 'registered',
        registrationDate: '2026-09-17',
      })
      .expect(200)

    expect(response.body).toEqual({
      orderItem: expect.objectContaining({
        id: orderItem?.id,
        orderId: order?.id,
        motorcycleId: motorcycle?.id,
        registrationStatus: 'registered',
        registrationDate: '2026-09-17',
      }),
    })
  })

  it('should be able to update only the registration status', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
      })
      .returning()

    const [orderItem] = await db
      .insert(orderItems)
      .values({
        orderId: order?.id,
        motorcycleId: motorcycle?.id,
        registrationDate: '2026-09-10',
      })
      .returning()

    const response = await authenticated
      .put(`/api/orders/items/${orderItem?.id}`)
      .send({
        registrationStatus: 'registering',
      })
      .expect(200)

    expect(response.body.orderItem.registrationStatus).toBe('registering')
    expect(response.body.orderItem.registrationDate).toBe('2026-09-10')
  })

  it('should be able to clear the registration date', async () => {
    const { customer } = await createCustomer()
    const { motorcycle } = await createMotorcycle()

    const [order] = await db
      .insert(orders)
      .values({
        customerId: customer?.id,
        seller: 'Carlos',
      })
      .returning()

    const [orderItem] = await db
      .insert(orderItems)
      .values({
        orderId: order?.id,
        motorcycleId: motorcycle?.id,
        registrationStatus: 'registered',
        registrationDate: '2026-09-17',
      })
      .returning()

    const response = await authenticated
      .put(`/api/orders/items/${orderItem?.id}`)
      .send({
        registrationDate: null,
      })
      .expect(200)

    expect(response.body.orderItem.registrationDate).toBeNull()
  })

  it('should not be able to update a non-existing order item', async () => {
    const response = await authenticated
      .put('/api/orders/items/00000000-0000-0000-0000-000000000000')
      .send({
        registrationStatus: 'registered',
      })
      .expect(404)

    expect(response.body).toEqual({
      message: 'Resource not found.',
    })
  })

  it('should not be able to update an order item with an invalid id', async () => {
    const response = await authenticated
      .put('/api/orders/items/invalid-id')
      .send({
        registrationStatus: 'registered',
      })
      .expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })

  it('should not be able to update an order item with invalid data', async () => {
    const response = await authenticated
      .put('/api/orders/items/00000000-0000-0000-0000-000000000000')
      .send({
        registrationStatus: 'invalid',
      })
      .expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })
})
