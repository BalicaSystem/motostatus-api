import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeReleaseOrderItemUseCase } from '../../../use-cases/factories/make-release-order-item-use-case'

const releaseOrderItemParamsSchema = z.object({
  id: z.uuid(),
})

export async function releaseOrderItem(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = releaseOrderItemParamsSchema.parse(request.params)

  const releaseOrderItem = makeReleaseOrderItemUseCase()

  const { orderItem } = await releaseOrderItem.execute({ id })

  return reply.status(200).send({ orderItem })
}
