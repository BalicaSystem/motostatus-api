import type { FastifyInstance } from 'fastify'
import { login } from './login'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', login)
}
