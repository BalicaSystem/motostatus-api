import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchMotorcyclesUseCase } from '../../../use-cases/factories/make-fetch-motorcycles-use-case'

const fetchMotorcyclesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(20),
  q: z.string().trim().optional(),
  status: z.enum(['in_transit', 'delayed', 'arrived']).optional(),
})

export async function fetchMotorcycles(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page, perPage, q, status } = fetchMotorcyclesQuerySchema.parse(
    request.query,
  )

  const fetchMotorcycles = makeFetchMotorcyclesUseCase()

  const result = await fetchMotorcycles.execute({
    page,
    perPage,
    search: q,
    status,
  })

  return reply.status(200).send(result)
}
