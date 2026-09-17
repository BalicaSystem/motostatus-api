import type { FastifyInstance } from 'fastify'
import { create } from './create-motorcycle'
import { fetchMotorcycleById } from './fetch-motorcycle-by-id'

export async function motorcyclesRoutes(app: FastifyInstance) {
  app.post('/motorcycles', create)
  app.get('/motorcycles/:id', fetchMotorcycleById)
}
