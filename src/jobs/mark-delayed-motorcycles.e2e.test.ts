import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db'
import { motorcycles, orderItems, orders } from '../db/schema'
import { createMotorcycle } from '../utils/test/create-motorcycle'
import { makeMarkDelayedMotorcyclesUseCase } from '../use-cases/factories/make-mark-delayed-motorcycles-use-case'

describe('Mark Delayed Motorcycles Job (e2e)', () => {
  beforeEach(async () => {
    await db.delete(orderItems)
    await db.delete(orders)
    await db.delete(motorcycles)
  })

  it('should mark overdue in transit motorcycles as delayed', async () => {
    const { motorcycle: overdue } = await createMotorcycle({
      chassis: '9C2KC0810GR123456',
      estimatedArrival: '2026-09-21',
      status: 'in_transit',
    })
    const { motorcycle: notOverdueYet } = await createMotorcycle({
      chassis: '9C2KC0810GR123457',
      estimatedArrival: '2026-09-22',
      status: 'in_transit',
    })
    const { motorcycle: arrived } = await createMotorcycle({
      chassis: '9C2KC0810GR123458',
      estimatedArrival: '2026-09-20',
      status: 'arrived',
    })

    const useCase = makeMarkDelayedMotorcyclesUseCase()
    const { count } = await useCase.execute({ referenceDate: '2026-09-22' })

    expect(count).toBe(1)

    const [updatedOverdue] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, overdue!.id))

    expect(updatedOverdue).toEqual(
      expect.objectContaining({
        id: overdue!.id,
        status: 'delayed',
      }),
    )

    const [notOverdue] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, notOverdueYet!.id))

    expect(notOverdue).toEqual(
      expect.objectContaining({
        id: notOverdueYet!.id,
        status: 'in_transit',
      }),
    )

    const [stillArrived] = await db
      .select()
      .from(motorcycles)
      .where(eq(motorcycles.id, arrived!.id))

    expect(stillArrived).toEqual(
      expect.objectContaining({
        id: arrived!.id,
        status: 'arrived',
      }),
    )
  })
})