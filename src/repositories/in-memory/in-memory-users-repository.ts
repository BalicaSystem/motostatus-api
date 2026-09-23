import { randomUUID } from 'node:crypto'
import type { NewUser, User } from '../../db/schema'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: NewUser): Promise<User | null> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(user)

    return user
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email === email.toLowerCase()) ?? null
  }
}
