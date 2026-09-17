import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'

describe('Create Motorcycle e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a motorcycle', async () => {
    const response = await request(app.server).post('/api/motorcycles').send({
      model: 'XRE 300',
      chassis: '9C2ND1120MR000742',
      estimatedArrival: '2026-10-03',
    })

    expect(response.statusCode).toEqual(201)
  })
})
