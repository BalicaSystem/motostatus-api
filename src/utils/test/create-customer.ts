import { randomUUID } from 'node:crypto'
import { customers } from '../../db/schema'
import { db } from '../../db'

export async function createCustomer(
  data: Partial<typeof customers.$inferInsert> = {},
) {
  const [customer] = await db
    .insert(customers)
    .values({
      name: 'João da Silva',
      document: randomUUID(),
      city: 'Sobral',
      ...data,
    })
    .returning()

  return {
    customer,
  }
}
