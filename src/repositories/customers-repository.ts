import type { Customer, NewCustomer } from '../db/schema'

export interface FindManyCustomersParams {
  limit: number
  offset: number
  search?: string
}

export interface UpdateCustomerData {
  name?: string
  document?: string
  city?: string
}

export interface CustomerSearchParams {
  search?: string
}

export interface CustomersRepository {
  create(data: NewCustomer): Promise<Customer | null>
  findById(id: string): Promise<Customer | null>
  findByDocument(document: string): Promise<Customer | null>
  findMany(params: FindManyCustomersParams): Promise<Customer[]>
  count(params?: CustomerSearchParams): Promise<number>
  update(id: string, data: UpdateCustomerData): Promise<Customer>
  delete(id: string): Promise<void>
}
