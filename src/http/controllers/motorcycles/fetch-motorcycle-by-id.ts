import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchMotorcycleUseCase } from '../../../use-cases/factories/make-fetch-motorcycle-use-case'

export async function fetchMotorcycleById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string }

  const fetchMotorcycle = makeFetchMotorcycleUseCase()

  const { motorcycle } = await fetchMotorcycle.execute({
    id,
  })

  return reply.status(200).send({
    motorcycle,
  })
}
