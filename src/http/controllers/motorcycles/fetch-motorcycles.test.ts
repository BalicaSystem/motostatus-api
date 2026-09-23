import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { db } from '../../../db'
import { customers, motorcycles, orderItems, orders } from '../../../db/schema'

describe('Fetch Motorcycles (e2e)', () => {
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

  it('should be able to fetch motorcycles', async () => {
    await db.insert(motorcycles).values([
      {
        model: 'CG 160 Fan',
        chassis: 'ABCDEFGHIJKLMNOP1',
        status: 'in_transit',
        estimatedArrival: '2026-10-01',
      },
      {
        model: 'XRE 300',
        chassis: 'ABCDEFGHIJKLMNOP2',
        status: 'arrived',
        estimatedArrival: null,
      },
    ])

    const response = await request(app.server).get('/api/motorcycles')

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycles).toHaveLength(2)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(20)
    expect(response.body.total).toBe(2)
    expect(response.body.totalPages).toBe(1)
  })

  it('should be able to search motorcycles by model', async () => {
    await db.insert(motorcycles).values([
      {
        model: 'CG 160 Fan',
        chassis: 'ABCDEFGHIJKLMNOP1',
        status: 'in_transit',
        estimatedArrival: '2026-10-01',
      },
      {
        model: 'XRE 300',
        chassis: 'ABCDEFGHIJKLMNOP2',
        status: 'arrived',
        estimatedArrival: null,
      },
    ])

    const response = await request(app.server).get('/api/motorcycles?q=xre')

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycles).toHaveLength(1)
    expect(response.body.motorcycles[0]).toEqual(
      expect.objectContaining({ model: 'XRE 300' }),
    )
    expect(response.body.total).toBe(1)
  })

  it('should be able to search motorcycles by chassis', async () => {
    await db.insert(motorcycles).values([
      {
        model: 'CG 160 Fan',
        chassis: 'ABCDEFGHIJKLMNOP1',
        status: 'in_transit',
        estimatedArrival: '2026-10-01',
      },
      {
        model: 'CG 160 Fan',
        chassis: 'ZZZZZZZZZZZZZZZ2',
        status: 'delayed',
        estimatedArrival: '2026-09-01',
      },
    ])

    const response = await request(app.server).get('/api/motorcycles?q=ZZZZZZ')

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycles).toHaveLength(1)
    expect(response.body.motorcycles[0]).toEqual(
      expect.objectContaining({ chassis: 'ZZZZZZZZZZZZZZZ2' }),
    )
    expect(response.body.total).toBe(1)
  })

  it('should be able to filter motorcycles by status', async () => {
    await db.insert(motorcycles).values([
      {
        model: 'CG 160 Fan',
        chassis: 'ABCDEFGHIJKLMNOP1',
        status: 'in_transit',
        estimatedArrival: '2026-10-01',
      },
      {
        model: 'XRE 300',
        chassis: 'ABCDEFGHIJKLMNOP2',
        status: 'in_transit',
        estimatedArrival: '2026-10-05',
      },
      {
        model: 'Bros 160',
        chassis: 'ABCDEFGHIJKLMNOP3',
        status: 'arrived',
        estimatedArrival: null,
      },
    ])

    const response = await request(app.server).get(
      '/api/motorcycles?status=arrived',
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycles).toHaveLength(1)
    expect(response.body.motorcycles[0]).toEqual(
      expect.objectContaining({ status: 'arrived' }),
    )
    expect(response.body.total).toBe(1)
  })

  it('should be able to combine search and status filters', async () => {
    await db.insert(motorcycles).values([
      {
        model: 'CG 160 Fan',
        chassis: 'ABCDEFGHIJKLMNOP1',
        status: 'in_transit',
        estimatedArrival: '2026-10-01',
      },
      {
        model: 'CG 160 Fan',
        chassis: 'ABCDEFGHIJKLMNOP2',
        status: 'arrived',
        estimatedArrival: null,
      },
    ])

    const response = await request(app.server).get(
      '/api/motorcycles?q=fan&status=in_transit',
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycles).toHaveLength(1)
    expect(response.body.motorcycles[0]).toEqual(
      expect.objectContaining({ status: 'in_transit' }),
    )
    expect(response.body.total).toBe(1)
  })

  it('should not be able to fetch motorcycles with an invalid status', async () => {
    const response = await request(app.server).get(
      '/api/motorcycles?status=invalid',
    )

    expect(response.statusCode).toBe(400)
  })
})
