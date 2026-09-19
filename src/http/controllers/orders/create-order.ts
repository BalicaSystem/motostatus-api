import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateOrderUseCase } from '../../../use-cases/factories/make-create-order-use-case'

const createOrderBodySchema = z.object({
  customerId: z.uuid(),
  seller: z.string().min(1),
  billingDate: z.string().date().nullable().optional(),
  motorcycleIds: z.array(z.uuid()).min(1),
})

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { customerId, seller, billingDate, motorcycleIds } =
    createOrderBodySchema.parse(request.body)

  const createOrder = makeCreateOrderUseCase()

  const { order, orderItems } = await createOrder.execute({
    customerId,
    seller,
    billingDate,
    motorcycleIds,
  })

  return reply.status(201).send({
    order,
    orderItems,
  })
}
