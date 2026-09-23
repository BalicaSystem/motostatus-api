import type { FastifyInstance } from 'fastify'
import { UnauthorizedError } from '../../use-cases/errors/unauthorized-error'
import { authRoutes } from './auth/routes'
import { customersRoutes } from './customers/routes'
import { motorcyclesRoutes } from './motorcycles/routes'
import { ordersRoutes } from './orders/routes'

export async function apiRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (request, _reply) => {
    if (request.url.startsWith('/api/auth')) {
      return
    }

    try {
      await request.jwtVerify()
    } catch {
      throw new UnauthorizedError()
    }
  })

  await app.register(authRoutes)
  await app.register(customersRoutes)
  await app.register(motorcyclesRoutes)
  await app.register(ordersRoutes)
}
