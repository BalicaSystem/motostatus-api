import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createAuthedAgent } from '../../../utils/test/authed-agent'
import { createMotorcycle } from '../../../utils/test/create-motorcycle'

describe('Fetch Motorcycle by ID (e2e)', () => {
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

  it('should be able to fetch a motorcycle', async () => {
    const { motorcycle } = await createMotorcycle()

    const response = await authenticated.get(
      `/api/motorcycles/${motorcycle?.id}`,
    )

    expect(response.statusCode).toBe(200)
  })
})
