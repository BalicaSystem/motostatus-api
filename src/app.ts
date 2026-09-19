import fastify from 'fastify'
import { ZodError } from 'zod'
import cors from '@fastify/cors'

import { env } from './env'
import { apiRoutes } from './http/controllers/index.routes'
import { health } from './http/controllers/health'
import { ChassisAlreadyExistsError } from './use-cases/errors/chassis-already-exists-error'
import { ResourceNotFoundError } from './use-cases/errors/resource-not-found-error'
import { CustomerAlreadyExistsError } from './use-cases/errors/customer-already-exists-error'
import { MotorcycleUnavailableError } from './use-cases/errors/motorcycle-unavailable-error'
import { MotorcycleCannotBeCheckedInError } from './use-cases/errors/motorcycle-cannot-be-checked-in-error'
import { OrderItemCannotBeReleasedError } from './use-cases/errors/order-item-cannot-be-released-error'
import { OrderItemCannotBeCompletedError } from './use-cases/complete-order-item'

export const app = fastify()

await app.register(cors, {
  origin: ['http://localhost:3000', 'https://www.motostatus.com.br'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
})

app.get('/health', health)

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

  if (error instanceof CustomerAlreadyExistsError) {
    return reply.status(409).send({
      message: error.message,
    })
  }

  if (error instanceof MotorcycleUnavailableError) {
    return reply.status(409).send({
      message: error.message,
    })
  }

  if (error instanceof MotorcycleCannotBeCheckedInError) {
    return reply.status(409).send({
      message: error.message,
    })
  }

  if (error instanceof OrderItemCannotBeReleasedError) {
    return reply.status(409).send({
      message: error.message,
    })
  }

  if (error instanceof OrderItemCannotBeCompletedError) {
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
