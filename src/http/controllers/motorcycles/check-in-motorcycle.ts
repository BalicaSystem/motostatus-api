import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInMotorcycleUseCase } from '../../../use-cases/factories/make-check-in-motorcycle-use-case'

const checkInBodySchema = z.object({
  chassis: z.string().min(1, 'Chassis is required'),
})

export async function checkInMotorcycle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { chassis } = checkInBodySchema.parse(request.body)

  const checkInMotorcycle = makeCheckInMotorcycleUseCase()

  const { motorcycle } = await checkInMotorcycle.execute({ chassis })

  return reply.status(200).send({ motorcycle })
}