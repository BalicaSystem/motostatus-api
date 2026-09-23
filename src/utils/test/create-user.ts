import { hashSync } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { db } from '../../db'
import { users } from '../../db/schema'

export const TEST_PASSWORD = 'MotoStatus@2026!'

export async function createUser(
  data: Partial<typeof users.$inferInsert> = {},
) {
  const [user] = await db
    .insert(users)
    .values({
      name: 'Admin',
      email: `${randomUUID()}@motostatus.com.br`,
      passwordHash: hashSync(TEST_PASSWORD, 6),
      ...data,
    })
    .returning()

  return { user }
}
