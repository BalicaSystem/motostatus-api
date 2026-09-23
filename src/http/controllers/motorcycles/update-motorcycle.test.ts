import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { db } from '../../../db'
import { motorcycles, orderItems, orders, users } from '../../../db/schema'
import { createAuthedAgent } from '../../../utils/test/authed-agent'
import { createMotorcycle } from '../../../utils/test/create-motorcycle'

describe('Update Motorcycle (e2e)', () => {
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
    await db.delete(motorcycles)
    await db.delete(users)

    authenticated = await createAuthedAgent()
  })

  it('should be able to update a motorcycle', async () => {
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated
      .patch(`/api/motorcycles/${motorcycle?.id}`)
      .send({
        model: 'CG 160 Titan',
        chassis: 'TEST-456',
        estimatedArrival: '2026-10-01',
        status: 'arrived',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycle).toEqual(
      expect.objectContaining({
        id: motorcycle?.id,
        model: 'CG 160 Titan',
        chassis: 'TEST-456',
        estimatedArrival: '2026-10-01',
        status: 'arrived',
      }),
    )
  })

  it('should be able to update only the status', async () => {
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated
      .patch(`/api/motorcycles/${motorcycle?.id}`)
      .send({
        status: 'arrived',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycle).toEqual(
      expect.objectContaining({
        id: motorcycle?.id,
        model: motorcycle?.model,
        chassis: motorcycle?.chassis,
        estimatedArrival: motorcycle?.estimatedArrival,
        status: 'arrived',
      }),
    )
  })

  it('should be able to update only the model', async () => {
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated
      .patch(`/api/motorcycles/${motorcycle?.id}`)
      .send({
        model: 'CG 160 Titan',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycle.model).toBe('CG 160 Titan')
    expect(response.body.motorcycle.chassis).toBe(motorcycle?.chassis)
    expect(response.body.motorcycle.status).toBe(motorcycle?.status)
  })

  it('should be able to remove the estimated arrival', async () => {
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated
      .patch(`/api/motorcycles/${motorcycle?.id}`)
      .send({
        estimatedArrival: null,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycle.estimatedArrival).toBeNull()
  })

  it('should not be able to update a non-existing motorcycle', async () => {
    const response = await authenticated
      .patch('/api/motorcycles/00000000-0000-0000-0000-000000000000')
      .send({
        model: 'CG 160 Titan',
      })

    expect(response.statusCode).toBe(404)
  })

  it('should not be able to update with an existing chassis', async () => {
    const { motorcycle: firstMotorcycle } = await createMotorcycle({
      chassis: 'TEST-123',
    })

    const { motorcycle: secondMotorcycle } = await createMotorcycle({
      chassis: 'TEST-456',
    })

    const response = await authenticated
      .patch(`/api/motorcycles/${secondMotorcycle?.id}`)
      .send({
        chassis: firstMotorcycle?.chassis,
      })

    expect(response.statusCode).toBe(409)
  })

  it('should be able to keep the same chassis', async () => {
    const { motorcycle } = await createMotorcycle({
      chassis: 'TEST-123',
    })

    const response = await authenticated
      .patch(`/api/motorcycles/${motorcycle?.id}`)
      .send({
        model: 'CG 160 Titan',
        chassis: motorcycle?.chassis,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycle.chassis).toBe('TEST-123')
  })
})
