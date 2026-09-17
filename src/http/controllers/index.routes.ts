import type { FastifyInstance } from 'fastify'
import { customersRoutes } from './customers/routes'
import { motorcyclesRoutes } from './motorcycles/routes'
import { ordersRoutes } from './orders/routes'

export async function apiRoutes(app: FastifyInstance) {
  await app.register(customersRoutes)
  await app.register(motorcyclesRoutes)
  await app.register(ordersRoutes)
}
