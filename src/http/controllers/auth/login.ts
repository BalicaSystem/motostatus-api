import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeAuthenticateUseCase } from '../../../use-cases/factories/make-authenticate-use-case'

const authenticateBodySchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
})

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = authenticateBodySchema.parse(request.body)

  const authenticate = makeAuthenticateUseCase()

  const { userId, name } = await authenticate.execute({ email, password })

  const token = await reply.jwtSign(
    { sub: userId },
    {
      expiresIn: '7d',
    },
  )

  return reply.status(200).send({
    token,
    user: {
      id: userId,
      name,
      email,
    },
  })
}
