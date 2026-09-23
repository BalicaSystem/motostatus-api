import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { db } from '../../../db'
import { users } from '../../../db/schema'
import { TEST_PASSWORD, createUser } from '../../../utils/test/create-user'

describe('Login (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(users)
  })

  it('should be able to login with valid credentials', async () => {
    const { user } = await createUser({
      email: 'admin@motostatus.com.br',
    })

    const response = await request(app.server).post('/api/auth/login').send({
      email: 'admin@motostatus.com.br',
      password: TEST_PASSWORD,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.token).toEqual(expect.any(String))
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user?.id,
        email: 'admin@motostatus.com.br',
      }),
    )
  })

  it('should not be able to login with a wrong password', async () => {
    await createUser({
      email: 'admin@motostatus.com.br',
    })

    const response = await request(app.server).post('/api/auth/login').send({
      email: 'admin@motostatus.com.br',
      password: 'wrong-password',
    })

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      message: 'Invalid credentials.',
    })
  })

  it('should not be able to login with an unknown email', async () => {
    const response = await request(app.server).post('/api/auth/login').send({
      email: 'unknown@motostatus.com.br',
      password: TEST_PASSWORD,
    })

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      message: 'Invalid credentials.',
    })
  })

  it('should not be able to login with an invalid body', async () => {
    const response = await request(app.server).post('/api/auth/login').send({
      email: 'invalid-email',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Validation error.')
  })
})
