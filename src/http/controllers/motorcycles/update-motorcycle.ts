import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateMotorcycleUseCase } from '../../../use-cases/factories/make-update-motorcycle-use-case'

const updateMotorcycleParamsSchema = z.object({
  id: z.uuid(),
})

const updateMotorcycleBodySchema = z.object({
  model: z.string().min(1).optional(),
  chassis: z.string().min(1).optional(),
  estimatedArrival: z.iso.date().nullable().optional(),
  status: z.enum(['in_transit', 'delayed', 'arrived']).optional(),
})

export async function updateMotorcycle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateMotorcycleParamsSchema.parse(request.params)
  const body = updateMotorcycleBodySchema.parse(request.body)

  const updateMotorcycle = makeUpdateMotorcycleUseCase()

  const result = await updateMotorcycle.execute({
    id,
    ...body,
  })

  return reply.status(200).send(result)
}
