import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateCustomerUseCase } from '../../../use-cases/factories/make-update-customer-use-case'

const updateCustomerParamsSchema = z.object({
  id: z.uuid(),
})

const updateCustomerBodySchema = z.object({
  name: z.string().min(1).optional(),
  document: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
})

export async function updateCustomer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateCustomerParamsSchema.parse(request.params)
  const body = updateCustomerBodySchema.parse(request.body)

  const updateCustomer = makeUpdateCustomerUseCase()

  const result = await updateCustomer.execute({
    id,
    ...body,
  })

  return reply.status(200).send(result)
}
