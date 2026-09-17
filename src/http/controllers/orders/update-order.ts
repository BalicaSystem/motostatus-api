import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateOrderUseCase } from '../../../use-cases/factories/make-update-order-use-case'

const updateOrderParamsSchema = z.object({
  id: z.uuid(),
})

const updateOrderBodySchema = z.object({
  seller: z.string().min(1).optional(),
  billingDate: z.string().date().nullable().optional(),
})

export async function updateOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateOrderParamsSchema.parse(request.params)
  const { seller, billingDate } = updateOrderBodySchema.parse(request.body)

  const updateOrder = makeUpdateOrderUseCase()

  const { order } = await updateOrder.execute({
    id,
    seller,
    billingDate,
  })

  return reply.status(200).send({
    order,
  })
}
