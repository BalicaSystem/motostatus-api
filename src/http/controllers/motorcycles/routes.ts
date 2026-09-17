import type { FastifyInstance } from 'fastify'
import { create } from './create-motorcycle'
import { fetchMotorcycleById } from './fetch-motorcycle-by-id'
import { fetchMotorcycles } from './fetch-motorcyles'
import { updateMotorcycle } from './update-motorcycle'

export async function motorcyclesRoutes(app: FastifyInstance) {
  app.post('/motorcycles', create)
  app.get('/motorcycles', fetchMotorcycles)
  app.get('/motorcycles/:id', fetchMotorcycleById)
  app.patch('/motorcycles/:id', updateMotorcycle)
}
