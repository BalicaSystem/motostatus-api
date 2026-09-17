import { db } from '../../db'
import { motorcycles } from '../../db/schema'

export async function createMotorcycle(
  data: Partial<typeof motorcycles.$inferInsert> = {},
) {
  const [motorcycle] = await db
    .insert(motorcycles)
    .values({
      model: 'CG 160 Fan',
      chassis: '9C2KC0810KR000001',
      estimatedArrival: '2026-09-25',
      status: 'in_transit',
      ...data,
    })
    .returning()

  return {
    motorcycle,
  }
}
