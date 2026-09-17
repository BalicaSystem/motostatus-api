import { randomUUID } from 'node:crypto'
import type { Customer, NewCustomer } from '../../db/schema'
import type {
  CustomersRepository,
  FindManyCustomersParams,
  UpdateCustomerData,
} from '../customers-repository'

export class InMemoryCustomersRepository implements CustomersRepository {
  public items: Customer[] = []

  async create(data: NewCustomer): Promise<Customer> {
    const customer: Customer = {
      id: data.id ?? randomUUID(),
      name: data.name,
      document: data.document,
      city: data.city,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(customer)

    return customer
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.id === id)

    return customer ?? null
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.document === document)

    return customer ?? null
  }

  async findMany({
    limit,
    offset,
  }: FindManyCustomersParams): Promise<Customer[]> {
    return this.items.slice(offset, offset + limit)
  }

  async count(): Promise<number> {
    return this.items.length
  }

  async update(id: string, data: UpdateCustomerData): Promise<Customer> {
    const customer = this.items.find((item) => item.id === id)

    if (!customer) {
      throw new Error('Customer not found')
    }

    Object.assign(customer, {
      ...data,
      updatedAt: new Date(),
    })

    return customer
  }

  async delete(id: string): Promise<void> {
    const customerIndex = this.items.findIndex((item) => item.id === id)

    if (customerIndex === -1) {
      throw new Error('Customer not found')
    }

    this.items.splice(customerIndex, 1)
  }
}
