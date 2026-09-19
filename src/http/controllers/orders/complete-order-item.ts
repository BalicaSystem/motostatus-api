import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCompleteOrderItemUseCase } from '../../../use-cases/factories/make-complete-order-item-use-case'

const completeOrderItemParamsSchema = z.object({
  id: z.uuid(),
})

export async function completeOrderItem(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = completeOrderItemParamsSchema.parse(request.params)

  const completeOrderItem = makeCompleteOrderItemUseCase()

  const { orderItem } = await completeOrderItem.execute({ id })

  return reply.status(200).send({ orderItem })
}
