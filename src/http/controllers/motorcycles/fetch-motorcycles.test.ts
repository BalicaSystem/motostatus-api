import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createMotorcycle } from '../../../utils/test/create-motorcycle'
import { db } from '../../../db'
import { motorcycles } from '../../../db/schema'

describe('Fetch Motorcycles (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await db.delete(motorcycles)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch motorcycles', async () => {
    await createMotorcycle()

    await createMotorcycle()

    const response = await request(app.server).get(
      '/api/motorcycles?page=1&perPage=20',
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycles).toHaveLength(2)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(20)
    expect(response.body.total).toBe(2)
    expect(response.body.totalPages).toBe(1)
  })

  it('should be able to fetch motorcycles with pagination', async () => {
    await createMotorcycle()

    await createMotorcycle()

    await createMotorcycle()

    const response = await request(app.server).get(
      '/api/motorcycles?page=1&perPage=2',
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycles).toHaveLength(2)
    expect(response.body.page).toBe(1)
    expect(response.body.perPage).toBe(2)
    expect(response.body.total).toBe(3)
    expect(response.body.totalPages).toBe(2)
  })

  it('should be able to fetch the second page', async () => {
    await createMotorcycle()

    await createMotorcycle()

    await createMotorcycle()

    const response = await request(app.server).get(
      '/api/motorcycles?page=2&perPage=2',
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.motorcycles).toHaveLength(1)
    expect(response.body.page).toBe(2)
    expect(response.body.perPage).toBe(2)
    expect(response.body.total).toBe(3)
    expect(response.body.totalPages).toBe(2)
  })
})
