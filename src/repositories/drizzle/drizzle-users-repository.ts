import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users, type NewUser, type User } from '../../db/schema'
import type { UsersRepository } from '../users-repository'

export class DrizzleUsersRepository implements UsersRepository {
  async create(data: NewUser): Promise<User | null> {
    const [user] = await db.insert(users).values(data).returning()

    return user ?? null
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id))

    return user ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))

    return user ?? null
  }
}
