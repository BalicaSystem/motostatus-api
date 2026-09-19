import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchMotorcyclesUseCase } from '../../../use-cases/factories/make-fetch-motorcycles-use-case'

interface FetchMotorcyclesRequest {
  page?: string
  perPage?: string
}

export async function fetchMotorcycles(
  request: FastifyRequest<{
    Querystring: FetchMotorcyclesRequest
  }>,
  reply: FastifyReply,
) {
  const fetchMotorcycles = makeFetchMotorcyclesUseCase()

  const page = Number(request.query.page ?? 1)
  const perPage = Number(request.query.perPage ?? 20)

  const result = await fetchMotorcycles.execute({
    page,
    perPage,
  })

  return reply.status(200).send(result)
}
