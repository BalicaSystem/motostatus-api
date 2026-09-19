import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteOrderUseCase } from '../../../use-cases/factories/make-delete-order-use-case'

const deleteOrderParamsSchema = z.object({
  id: z.uuid(),
})

export async function deleteOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteOrderParamsSchema.parse(request.params)

  const deleteOrder = makeDeleteOrderUseCase()

  await deleteOrder.execute({
    id,
  })

  return reply.status(204).send()
}
