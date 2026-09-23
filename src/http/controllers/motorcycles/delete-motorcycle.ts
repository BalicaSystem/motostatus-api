import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteMotorcycleUseCase } from '../../../use-cases/factories/make-delete-motorcycle-use-case'

const deleteMotorcycleParamsSchema = z.object({
  id: z.uuid(),
})

export async function deleteMotorcycle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteMotorcycleParamsSchema.parse(request.params)

  const deleteMotorcycle = makeDeleteMotorcycleUseCase()

  await deleteMotorcycle.execute({
    id,
  })

  return reply.status(204).send()
}
