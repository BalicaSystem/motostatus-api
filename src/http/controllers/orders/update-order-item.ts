import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateOrderItemUseCase } from '../../../use-cases/factories/make-update-order-item-use-case'

const updateOrderItemParamsSchema = z.object({
  id: z.uuid(),
})

const updateOrderItemBodySchema = z.object({
  registrationStatus: z
    .enum(['without_registration', 'registering', 'registered'])
    .optional(),
  registrationDate: z.string().date().nullable().optional(),
})

export async function updateOrderItem(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateOrderItemParamsSchema.parse(request.params)

  const { registrationStatus, registrationDate } =
    updateOrderItemBodySchema.parse(request.body)

  const updateOrderItem = makeUpdateOrderItemUseCase()

  const { orderItem } = await updateOrderItem.execute({
    id,
    registrationStatus,
    registrationDate,
  })

  return reply.status(200).send({
    orderItem,
  })
}
