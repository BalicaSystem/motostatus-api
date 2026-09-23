import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createAuthedAgent } from '../../../utils/test/authed-agent'

describe('Create Motorcycle e2e', () => {
  let authenticated: Awaited<ReturnType<typeof createAuthedAgent>>

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    authenticated = await createAuthedAgent()
  })

  it('should be able to create a motorcycle', async () => {
    const response = await authenticated.post('/api/motorcycles').send({
      model: 'XRE 300',
      chassis: '9C2ND1120MR000742',
      estimatedArrival: '2026-10-03',
    })

    expect(response.statusCode).toEqual(201)
  })
})
