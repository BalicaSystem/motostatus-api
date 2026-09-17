import { db } from '../../db'
import { motorcycles } from '../../db/schema'
import { randomUUID } from 'node:crypto'

export async function createMotorcycle(
  data: Partial<typeof motorcycles.$inferInsert> = {},
) {
  const [motorcycle] = await db
    .insert(motorcycles)
    .values({
      model: 'CG 160 Fan',
      chassis: `TEST-${randomUUID()}`,
      estimatedArrival: '2026-09-25',
      status: 'in_transit',
      ...data,
    })
    .returning()

  return {
    motorcycle,
  }
}
