import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteCustomerUseCase } from '../../../use-cases/factories/make-delete-customer-use-case'

const deleteCustomerParamsSchema = z.object({
  id: z.uuid(),
})

export async function deleteCustomer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteCustomerParamsSchema.parse(request.params)

  const deleteCustomer = makeDeleteCustomerUseCase()

  await deleteCustomer.execute({
    id,
  })

  return reply.status(204).send()
}
