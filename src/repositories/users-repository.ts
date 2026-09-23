import type { NewUser, User } from '../db/schema'

export interface UsersRepository {
  create(data: NewUser): Promise<User | null>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}
