import type { FastifyInstance } from 'fastify'

import { motorcyclesRoutes } from './motorcycles/routes'
import { customersRoutes } from './customers/routes'

export async function apiRoutes(app: FastifyInstance) {
  app.register(motorcyclesRoutes)
  app.register(customersRoutes)
}
