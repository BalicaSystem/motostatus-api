import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createMotorcycle } from '../../../utils/test/create-motorcycle'

describe('Fetch Motorcycle by ID (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch a motorcycle', async () => {
    const { motorcycle } = await createMotorcycle()

    const response = await request(app.server).get(
      `/api/motorcycles/${motorcycle?.id}`,
    )

    expect(response.statusCode).toBe(200)
  })
})