import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchOrdersUseCase } from '../../../use-cases/factories/make-fetch-orders-use-case'

const fetchOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().trim().optional(),
})

export async function fetchOrders(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page, perPage, q } = fetchOrdersQuerySchema.parse(request.query)

  const fetchOrders = makeFetchOrdersUseCase()

  const { orders, meta } = await fetchOrders.execute({
    page,
    perPage,
    search: q,
  })

  return reply.status(200).send({
    orders,
    meta,
  })
}
