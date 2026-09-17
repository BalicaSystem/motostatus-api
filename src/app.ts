import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { apiRoutes } from './http/controllers/index.routes'
import { ChassisAlreadyExistsError } from './use-cases/errors/chassis-already-exists-error'
import { ResourceNotFoundError } from './use-cases/errors/resource-not-found-error'

export const app = fastify()

app.register(apiRoutes, {
  prefix: '/api',
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  if (error instanceof ChassisAlreadyExistsError) {
    return reply.status(409).send({
      message: error.message,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Create LOG
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})
