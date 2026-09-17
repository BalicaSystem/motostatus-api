import type { FastifyInstance } from 'fastify'
import { createOrder } from './create-order'
import { deleteOrder } from './delete-order'
import { fetchOrderById } from './fetch-order-by-id'
import { fetchOrders } from './fetch-orders'
import { updateOrder } from './update-order'
import { updateOrderItem } from './update-order-item'

export async function ordersRoutes(app: FastifyInstance) {
  app.post('/orders', createOrder)
  app.get('/orders', fetchOrders)
  app.get('/orders/:id', fetchOrderById)
  app.put('/orders/:id', updateOrder)
  app.put('/orders/items/:id', updateOrderItem)
  app.delete('/orders/:id', deleteOrder)
}
