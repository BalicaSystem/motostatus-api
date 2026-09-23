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

describe('Update Customer (e2e)', () => {
  let authenticated: Awaited<ReturnType<typeof createAuthedAgent>>

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await app.ready()

    await db.delete(orderItems)
    await db.delete(orders)
    await db.delete(customers)
    await db.delete(motorcycles)
    await db.delete(users)

    authenticated = await createAuthedAgent()
  })

  it('should be able to update a customer', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated
      .patch(`/api/customers/${customer?.id}`)
      .send({
        name: 'João da Silva',
        document: '98765432100',
        city: 'Fortaleza',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.customer).toEqual(
      expect.objectContaining({
        id: customer?.id,
        name: 'João da Silva',
        document: '98765432100',
        city: 'Fortaleza',
      }),
    )
  })

  it('should be able to update only the name', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated
      .patch(`/api/customers/${customer?.id}`)
      .send({
        name: 'João da Silva',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.customer).toEqual(
      expect.objectContaining({
        id: customer?.id,
        name: 'João da Silva',
        document: customer?.document,
        city: customer?.city,
      }),
    )
  })

  it('should be able to update only the document', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated
      .patch(`/api/customers/${customer?.id}`)
      .send({
        document: '98765432100',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.customer.document).toBe('98765432100')
    expect(response.body.customer.name).toBe(customer?.name)
    expect(response.body.customer.city).toBe(customer?.city)
  })

  it('should be able to update only the city', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated
      .patch(`/api/customers/${customer?.id}`)
      .send({
        city: 'Fortaleza',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.customer.city).toBe('Fortaleza')
    expect(response.body.customer.name).toBe(customer?.name)
    expect(response.body.customer.document).toBe(customer?.document)
  })

  it('should be able to keep the same document', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated
      .patch(`/api/customers/${customer?.id}`)
      .send({
        name: 'João da Silva',
        document: customer?.document,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.customer.document).toBe(customer?.document)
    expect(response.body.customer.name).toBe('João da Silva')
  })

  it('should not be able to update a non-existing customer', async () => {
    const response = await authenticated
      .patch(`/api/customers/${randomUUID()}`)
      .send({
        name: 'João da Silva',
      })

    expect(response.statusCode).toBe(404)
  })

  it('should not be able to update with an existing document', async () => {
    const { customer: firstCustomer } = await createCustomer({
      document: '12345678900',
    })

    const { customer: secondCustomer } = await createCustomer({
      document: '98765432100',
    })

    const response = await authenticated
      .patch(`/api/customers/${secondCustomer?.id}`)
      .send({
        document: firstCustomer?.document,
      })

    expect(response.statusCode).toBe(409)
  })

  it('should not be able to update with an invalid id', async () => {
    const response = await authenticated
      .patch('/api/customers/invalid-id')
      .send({
        name: 'João da Silva',
      })

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to update with an invalid name', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated
      .patch(`/api/customers/${customer?.id}`)
      .send({
        name: '',
      })

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to update with an invalid document', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated
      .patch(`/api/customers/${customer?.id}`)
      .send({
        document: '',
      })

    expect(response.statusCode).toBe(400)
  })

  it('should not be able to update with an invalid city', async () => {
    const { customer } = await createCustomer()

    const response = await authenticated
      .patch(`/api/customers/${customer?.id}`)
      .send({
        city: '',
      })

    expect(response.statusCode).toBe(400)
  })
})
