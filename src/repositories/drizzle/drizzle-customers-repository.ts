import { count, desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { customers, type Customer, type NewCustomer } from '../../db/schema'
import type {
  CustomersRepository,
  FindManyCustomersParams,
  UpdateCustomerData,
} from '../customers-repository'

export class DrizzleCustomersRepository implements CustomersRepository {
  async findById(id: string): Promise<Customer | null> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))

    return customer ?? null
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.document, document))

    return customer ?? null
  }

  async findMany({ limit, offset }: FindManyCustomersParams) {
    return db
      .select()
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async count() {
    const [result] = await db.select({ count: count() }).from(customers)

    return result?.count ?? 0
  }

  async create(data: NewCustomer): Promise<Customer | null> {
    const [customer] = await db.insert(customers).values(data).returning()

    return customer ?? null
  }

  async update(id: string, data: UpdateCustomerData): Promise<Customer> {
    const [customer] = await db
      .update(customers)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning()

    return customer!
  }

  async delete(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id))
  }
}
