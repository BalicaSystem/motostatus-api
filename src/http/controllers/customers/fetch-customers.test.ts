import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { db } from '../../../db'
import { customers } from '../../../db/schema'

describe('Fetch Customers (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(customers)
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

    const response = await request(app.server).get('/api/customers')

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

    const response = await request(app.server).get(
      '/api/customers?page=1&perPage=2',
    )

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

    const response = await request(app.server).get(
      '/api/customers?page=2&perPage=2',
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.customers).toHaveLength(1)
    expect(response.body.page).toBe(2)
    expect(response.body.total).toBe(3)
    expect(response.body.totalPages).toBe(2)
  })

  it('should not be able to fetch customers with an invalid page', async () => {
    const response = await request(app.server).get('/api/customers?page=0')

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to fetch customers with an invalid perPage', async () => {
    const response = await request(app.server).get('/api/customers?perPage=0')

    expect(response.statusCode).toBe(400)
  })
})
