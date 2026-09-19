import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateMotorcycleUseCase } from '../../../use-cases/factories/make-create-motorcycle-use-case'
import { MotorcycleAlreadyExistsError } from '../../../use-cases/errors/motorcycle-already-exists-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    model: z.string().min(1, 'Model is required'),
    chassis: z.string().min(1, 'Chassis is required'),
    estimatedArrival: z.iso.date().optional(),
  })

  const { model, chassis, estimatedArrival } = createBodySchema.parse(
    request.body,
  )

  try {
    const createMotorcycleUseCase = makeCreateMotorcycleUseCase()

    const motorcycle = await createMotorcycleUseCase.execute({
      model,
      chassis,
      estimatedArrival,
    })

    return reply.status(201).send({
      motorcycle,
    })
  } catch (err) {
    if (err instanceof MotorcycleAlreadyExistsError) {
      return reply.status(409).send({
        message: err.message,
      })
    }

    throw err
  }
}
