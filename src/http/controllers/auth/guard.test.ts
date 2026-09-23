import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { db } from '../../../db'
import { users } from '../../../db/schema'
import { createUser } from '../../../utils/test/create-user'

describe('Auth Guard (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(users)
  })

  it('should not be able to access a protected route without a token', async () => {
    const response = await request(app.server).get('/api/customers')

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      message: 'Unauthorized.',
    })
  })

  it('should not be able to access a protected route with an invalid token', async () => {
    const response = await request(app.server)
      .get('/api/customers')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      message: 'Unauthorized.',
    })
  })

  it('should be able to access a protected route with a valid token', async () => {
    const { user } = await createUser()
    const token = app.jwt.sign({ sub: user?.id }, { expiresIn: '1h' })

    const response = await request(app.server)
      .get('/api/customers')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
  })

  it('should keep the health check public', async () => {
    const response = await request(app.server).get('/health')

    expect(response.statusCode).toBe(200)
  })
})
