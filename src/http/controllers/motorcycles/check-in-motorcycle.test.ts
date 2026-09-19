import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { db } from '../../../db'
import { motorcycles } from '../../../db/schema'
import { createMotorcycle } from '../../../utils/test/create-motorcycle'

describe('Check In Motorcycle (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(motorcycles)
  })

  it('should be able to check in a motorcycle', async () => {
    const { motorcycle } = await createMotorcycle({
      chassis: '9C2KC0810GR123456',
    })

    const response = await request(app.server)
      .post('/api/motorcycles/check-in')
      .send({
        chassis: motorcycle?.chassis,
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

  it('should not be able to check in a non-existing motorcycle', async () => {
    const response = await request(app.server)
      .post('/api/motorcycles/check-in')
      .send({
        chassis: '9C2KC0810GR999999',
      })

    expect(response.statusCode).toBe(404)
  })

  it('should not be able to check in a motorcycle with status arrived', async () => {
    const { motorcycle } = await createMotorcycle({
      chassis: '9C2KC0810GR123456',
      status: 'arrived',
    })

    const response = await request(app.server)
      .post('/api/motorcycles/check-in')
      .send({
        chassis: motorcycle?.chassis,
      })

    expect(response.statusCode).toBe(409)
  })

  it('should not be able to check in a motorcycle with status delayed', async () => {
    const { motorcycle } = await createMotorcycle({
      chassis: '9C2KC0810GR123456',
      status: 'delayed',
    })

    const response = await request(app.server)
      .post('/api/motorcycles/check-in')
      .send({
        chassis: motorcycle?.chassis,
      })

    expect(response.statusCode).toBe(409)
  })

  it('should not be able to check in without a chassis', async () => {
    const response = await request(app.server)
      .post('/api/motorcycles/check-in')
      .send({})

    expect(response.statusCode).toBe(400)
  })
})