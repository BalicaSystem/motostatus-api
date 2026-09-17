import type { FastifyInstance } from 'fastify'
import { createOrder } from './create-order'
import { fetchOrders } from './fetch-orders'

export async function ordersRoutes(app: FastifyInstance) {
  app.post('/orders', createOrder)
  app.get('/orders', fetchOrders)
}
