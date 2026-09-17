import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateCustomerUseCase } from '../../../use-cases/factories/make-create-customer-use-case'

const createCustomerBodySchema = z.object({
  name: z.string().min(1),
  document: z.string().min(1),
  city: z.string().min(1),
})

export async function createCustomer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createCustomerBodySchema.parse(request.body)

  const createCustomer = makeCreateCustomerUseCase()

  const result = await createCustomer.execute(body)

  return reply.status(201).send(result)
}
