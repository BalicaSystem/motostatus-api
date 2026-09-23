import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { db } from '../../../db'
import { customers, orderItems, orders, users } from '../../../db/schema'
import { createAuthedAgent } from '../../../utils/test/authed-agent'

describe('Fetch Customers (e2e)', () => {
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
    await db.delete(users)

    authenticated = await createAuthedAgent()
  })

  it('should be able to fetch customers', async () => {
    await db.insert(customers).values([
      {
        name: 'João Silva',
        document: '12345678900',
        city: 'Sobral',
      },
      {
        name: 'Maria Silva',
        document: '98765432100',
        city: 'Fortaleza',
      },
    ])

    const response = await authenticated.get('/api/customers')

    expect(response.statusCode).toBe(200)
    expect(response.body.customers).toHaveLength(2)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(20)
    expect(response.body.total).toBe(2)
    expect(response.body.totalPages).toBe(1)
  })

  it('should be able to fetch customers with pagination', async () => {
    await db.insert(customers).values([
      {
        name: 'João Silva',
        document: '12345678900',
        city: 'Sobral',
      },
      {
        name: 'Maria Silva',
        document: '98765432100',
        city: 'Fortaleza',
      },
      {
        name: 'Pedro Silva',
        document: '45678912300',
        city: 'Caucaia',
      },
    ])

    const response = await authenticated.get('/api/customers?page=1&perPage=2')

    expect(response.statusCode).toBe(200)
    expect(response.body.customers).toHaveLength(2)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(2)
    expect(response.body.total).toBe(3)
    expect(response.body.totalPages).toBe(2)
  })

  it('should be able to fetch the second page', async () => {
    await db.insert(customers).values([
      {
        name: 'João Silva',
        document: '12345678900',
        city: 'Sobral',
      },
      {
        name: 'Maria Silva',
        document: '98765432100',
        city: 'Fortaleza',
      },
      {
        name: 'Pedro Silva',
        document: '45678912300',
        city: 'Caucaia',
      },
    ])

    const response = await authenticated.get('/api/customers?page=2&perPage=2')

    expect(response.statusCode).toBe(200)
    expect(response.body.customers).toHaveLength(1)
    expect(response.body.page).toBe(2)
    expect(response.body.total).toBe(3)
    expect(response.body.totalPages).toBe(2)
  })

  it('should not be able to fetch customers with an invalid page', async () => {
    const response = await authenticated.get('/api/customers?page=0')

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to fetch customers with an invalid perPage', async () => {
    const response = await authenticated.get('/api/customers?perPage=0')

    expect(response.statusCode).toBe(400)
  })

  it('should be able to search customers by name', async () => {
    await db.insert(customers).values([
      {
        name: 'João Silva',
        document: '12345678900',
        city: 'Sobral',
      },
      {
        name: 'Maria Souza',
        document: '98765432100',
        city: 'Fortaleza',
      },
    ])

    const response = await authenticated.get('/api/customers?q=silva')

    expect(response.statusCode).toBe(200)
    expect(response.body.customers).toHaveLength(1)
    expect(response.body.customers[0]).toEqual(
      expect.objectContaining({ name: 'João Silva' }),
    )
    expect(response.body.total).toBe(1)
    expect(response.body.totalPages).toBe(1)
  })

  it('should be able to search customers by document digits', async () => {
    await db.insert(customers).values([
      {
        name: 'João Silva',
        document: '123.456.789-00',
        city: 'Sobral',
      },
      {
        name: 'Maria Souza',
        document: '987.654.321-00',
        city: 'Fortaleza',
      },
    ])

    const response = await authenticated.get('/api/customers?q=987654321')

    expect(response.statusCode).toBe(200)
    expect(response.body.customers).toHaveLength(1)
    expect(response.body.customers[0]).toEqual(
      expect.objectContaining({ name: 'Maria Souza' }),
    )
    expect(response.body.total).toBe(1)
  })

  it('should return an empty list when search matches nothing', async () => {
    await db.insert(customers).values([
      {
        name: 'João Silva',
        document: '12345678900',
        city: 'Sobral',
      },
    ])

    const response = await authenticated.get('/api/customers?q=Aquiraz')

    expect(response.statusCode).toBe(200)
    expect(response.body.customers).toHaveLength(0)
    expect(response.body.total).toBe(0)
  })
})
