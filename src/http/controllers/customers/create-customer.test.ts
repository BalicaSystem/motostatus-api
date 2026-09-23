import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { db } from '../../../db'
import { customers, orderItems, orders, users } from '../../../db/schema'
import { createAuthedAgent } from '../../../utils/test/authed-agent'

describe('Create Customer (e2e)', () => {
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

  it('should be able to create a customer', async () => {
    const response = await authenticated.post('/api/customers').send({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body.customer).toEqual(
      expect.objectContaining({
        name: 'João Silva',
        document: '12345678900',
        city: 'Sobral',
      }),
    )
  })

  it('should not be able to create a customer with an existing document', async () => {
    await authenticated.post('/api/customers').send({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const response = await authenticated.post('/api/customers').send({
      name: 'Maria Silva',
      document: '12345678900',
      city: 'Fortaleza',
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not be able to create a customer without a name', async () => {
    const response = await authenticated.post('/api/customers').send({
      document: '12345678900',
      city: 'Sobral',
    })

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to create a customer without a document', async () => {
    const response = await authenticated.post('/api/customers').send({
      name: 'João Silva',
      city: 'Sobral',
    })

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to create a customer without a city', async () => {
    const response = await authenticated.post('/api/customers').send({
      name: 'João Silva',
      document: '12345678900',
    })

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to create a customer with an empty name', async () => {
    const response = await authenticated.post('/api/customers').send({
      name: '',
      document: '12345678900',
      city: 'Sobral',
    })

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to create a customer with an empty document', async () => {
    const response = await authenticated.post('/api/customers').send({
      name: 'João Silva',
      document: '',
      city: 'Sobral',
    })

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to create a customer with an empty city', async () => {
    const response = await authenticated.post('/api/customers').send({
      name: 'João Silva',
      document: '12345678900',
      city: '',
    })

    expect(response.statusCode).toBe(400)
  })
})
