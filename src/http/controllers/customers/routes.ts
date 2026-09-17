import type { FastifyInstance } from 'fastify'
import { createCustomer } from './create-customer'

export async function customersRoutes(app: FastifyInstance) {
  app.post('/customers', createCustomer)
}
