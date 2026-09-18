import type { FastifyInstance } from 'fastify'
import { createOrder } from './create-order'
import { deleteOrder } from './delete-order'
import { fetchOrderById } from './fetch-order-by-id'
import { fetchOrders } from './fetch-orders'
import { releaseOrderItem } from './release-order-item'
import { updateOrder } from './update-order'
import { updateOrderItem } from './update-order-item'
import { completeOrderItem } from './complete-order-item'

export async function ordersRoutes(app: FastifyInstance) {
  app.post('/orders', createOrder)
  app.get('/orders', fetchOrders)
  app.get('/orders/:id', fetchOrderById)
  app.put('/orders/:id', updateOrder)
  app.put('/orders/items/:id', updateOrderItem)
  app.post('/orders/items/:id/release', releaseOrderItem)
  app.post('/orders/items/:id/complete', completeOrderItem)
  app.delete('/orders/:id', deleteOrder)
}
