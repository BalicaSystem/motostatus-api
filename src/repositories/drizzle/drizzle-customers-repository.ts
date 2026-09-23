import { count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '../../db'
import { customers, type Customer, type NewCustomer } from '../../db/schema'
import type {
  CustomerSearchParams,
  CustomersRepository,
  FindManyCustomersParams,
  UpdateCustomerData,
} from '../customers-repository'

function customerSearchWhere(search: string) {
  const digits = search.replace(/\D/g, '')

  const conditions = [
    ilike(customers.name, `%${search}%`),
    ilike(customers.city, `%${search}%`),
    ilike(customers.document, `%${search}%`),
  ]

  if (digits) {
    conditions.push(
      sql`regexp_replace(${customers.document}, '[^0-9]', '', 'g') ILIKE ${`%${digits}%`}`,
    )
  }

  return or(...conditions)
}

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

  async findMany({ limit, offset, search }: FindManyCustomersParams) {
    return db
      .select()
      .from(customers)
      .where(search ? customerSearchWhere(search) : undefined)
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async count({ search }: CustomerSearchParams = {}) {
    const [result] = await db
      .select({ count: count() })
      .from(customers)
      .where(search ? customerSearchWhere(search) : undefined)

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
