import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchCustomersUseCase } from '../../../use-cases/factories/make-fetch-customers-use-case'

const fetchCustomersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(20),
})

export async function fetchCustomers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page, perPage } = fetchCustomersQuerySchema.parse(request.query)

  const fetchCustomers = makeFetchCustomersUseCase()

  const result = await fetchCustomers.execute({
    page,
    perPage,
  })

  return reply.status(200).send(result)
}
