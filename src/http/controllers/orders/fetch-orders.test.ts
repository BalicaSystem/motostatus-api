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

describe('Fetch Orders (e2e)', () => {
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

  it('should be able to fetch orders', async () => {
    const { customer } = await createCustomer()

    await db.insert(orders).values({
      customerId: customer?.id,
      seller: 'Carlos',
    })

    const response = await authenticated.get('/api/orders').expect(200)

    expect(response.body.orders).toHaveLength(1)
    expect(response.body.orders[0]).toEqual(
      expect.objectContaining({
        customer: {
          id: customer?.id,
          name: customer?.name,
          document: customer?.document,
        },
        seller: 'Carlos',
        billingDate: null,
        motorcycles: [],
      }),
    )

    expect(response.body.meta).toEqual({
      page: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
    })
  })

  it('should be able to fetch paginated orders', async () => {
    const { customer } = await createCustomer()

    for (let index = 1; index <= 15; index++) {
      await db.insert(orders).values({
        customerId: customer?.id,
        seller: `Seller ${index}`,
      })
    }

    const response = await authenticated
      .get('/api/orders?page=1&perPage=10')
      .expect(200)

    expect(response.body.orders).toHaveLength(10)

    expect(response.body.meta).toEqual({
      page: 1,
      perPage: 10,
      total: 15,
      totalPages: 2,
    })
  })

  it('should be able to fetch the second page of orders', async () => {
    const { customer } = await createCustomer()

    for (let index = 1; index <= 15; index++) {
      await db.insert(orders).values({
        customerId: customer?.id,
        seller: `Seller ${index}`,
      })
    }

    const response = await authenticated
      .get('/api/orders?page=2&perPage=10')
      .expect(200)

    expect(response.body.orders).toHaveLength(5)

    expect(response.body.meta).toEqual({
      page: 2,
      perPage: 10,
      total: 15,
      totalPages: 2,
    })
  })

  it('should return an empty list when the page does not contain orders', async () => {
    const { customer } = await createCustomer()

    for (let index = 1; index <= 5; index++) {
      await db.insert(orders).values({
        customerId: customer?.id,
        seller: `Seller ${index}`,
      })
    }

    const response = await authenticated
      .get('/api/orders?page=2&perPage=10')
      .expect(200)

    expect(response.body.orders).toEqual([])

    expect(response.body.meta).toEqual({
      page: 2,
      perPage: 10,
      total: 5,
      totalPages: 1,
    })
  })

  it('should use default pagination values', async () => {
    const { customer } = await createCustomer()

    for (let index = 1; index <= 15; index++) {
      await db.insert(orders).values({
        customerId: customer?.id,
        seller: `Seller ${index}`,
      })
    }

    const response = await authenticated.get('/api/orders').expect(200)

    expect(response.body.orders).toHaveLength(10)

    expect(response.body.meta).toEqual({
      page: 1,
      perPage: 10,
      total: 15,
      totalPages: 2,
    })
  })

  it('should return an empty list when there are no orders', async () => {
    const response = await authenticated.get('/api/orders').expect(200)

    expect(response.body.orders).toEqual([])

    expect(response.body.meta).toEqual({
      page: 1,
      perPage: 10,
      total: 0,
      totalPages: 0,
    })
  })

  it('should not be able to fetch orders with an invalid page', async () => {
    const response = await authenticated.get('/api/orders?page=0').expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })

  it('should not be able to fetch orders with an invalid perPage', async () => {
    const response = await authenticated
      .get('/api/orders?perPage=101')
      .expect(400)

    expect(response.body.message).toEqual('Validation error.')
  })

  it('should be able to search orders by customer name', async () => {
    const [customerA] = await db
      .insert(customers)
      .values({
        name: 'Carlos Alberto',
        document: '12345678900',
        city: 'Fortaleza',
      })
      .returning()

    const [customerB] = await db
      .insert(customers)
      .values({
        name: 'Maria Souza',
        document: '98765432100',
        city: 'Sobral',
      })
      .returning()

    await db.insert(orders).values([
      {
        customerId: customerA.id,
        seller: 'Ana Lima',
      },
      {
        customerId: customerB.id,
        seller: 'Bruno Costa',
      },
    ])

    const response = await authenticated.get('/api/orders?q=souza').expect(200)

    expect(response.body.orders).toHaveLength(1)
    expect(response.body.orders[0].customer.name).toBe('Maria Souza')
    expect(response.body.meta.total).toBe(1)
  })

  it('should be able to search orders by seller', async () => {
    const [customer] = await db
      .insert(customers)
      .values({
        name: 'João Silva',
        document: '12345678900',
        city: 'Sobral',
      })
      .returning()

    await db.insert(orders).values([
      {
        customerId: customer.id,
        seller: 'Ana Lima',
      },
      {
        customerId: customer.id,
        seller: 'Bruno Costa',
      },
    ])

    const response = await authenticated.get('/api/orders?q=ana').expect(200)

    expect(response.body.orders).toHaveLength(1)
    expect(response.body.orders[0].seller).toBe('Ana Lima')
    expect(response.body.meta.total).toBe(1)
  })
})
