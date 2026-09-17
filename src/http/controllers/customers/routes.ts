import type { FastifyInstance } from 'fastify'
import { createCustomer } from './create-customer'
import { fetchCustomers } from './fetch-customers'
import { fetchCustomerById } from './fetch-customer-by-id'

export async function customersRoutes(app: FastifyInstance) {
  app.post('/customers', createCustomer)
  app.get('/customers', fetchCustomers)
  app.get('/customers/:id', fetchCustomerById)
}
