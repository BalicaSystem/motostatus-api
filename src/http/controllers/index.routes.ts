import type { FastifyInstance } from 'fastify'
import { motorcyclesRoutes } from './motorcycles/routes'

export async function apiRoutes(app: FastifyInstance) {
  app.register(motorcyclesRoutes)
}
