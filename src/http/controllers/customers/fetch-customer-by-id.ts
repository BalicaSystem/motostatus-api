import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchCustomerByIdUseCase } from '../../../use-cases/factories/make-fetch-customer-by-id-use-case'

const fetchCustomerByIdParamsSchema = z.object({
  id: z.uuid(),
})

export async function fetchCustomerById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = fetchCustomerByIdParamsSchema.parse(request.params)

  const fetchCustomerById = makeFetchCustomerByIdUseCase()

  const result = await fetchCustomerById.execute({
    id,
  })

  return reply.status(200).send(result)
}
