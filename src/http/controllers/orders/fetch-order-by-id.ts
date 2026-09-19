import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchOrderByIdUseCase } from '../../../use-cases/factories/make-fetch-order-by-id-use-case'

const fetchOrderByIdParamsSchema = z.object({
  id: z.uuid(),
})

export async function fetchOrderById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = fetchOrderByIdParamsSchema.parse(request.params)

  const fetchOrderById = makeFetchOrderByIdUseCase()

  const { order, orderItems } = await fetchOrderById.execute({
    id,
  })

  return reply.status(200).send({
    order,
    orderItems,
  })
}
