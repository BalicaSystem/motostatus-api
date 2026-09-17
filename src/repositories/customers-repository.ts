import type { Customer, NewCustomer } from '../db/schema'

export interface FindManyCustomersParams {
  limit: number
  offset: number
}

export interface UpdateCustomerData {
  name?: string
  document?: string
  city?: string
}

export interface CustomersRepository {
  create(data: NewCustomer): Promise<Customer | null>
  findById(id: string): Promise<Customer | null>
  findByDocument(document: string): Promise<Customer | null>
  findMany(params: FindManyCustomersParams): Promise<Customer[]>
  count(): Promise<number>
  update(id: string, data: UpdateCustomerData): Promise<Customer>
  delete(id: string): Promise<void>
}
