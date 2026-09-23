import request from 'supertest'
import { app } from '../../app'
import { createUser } from './create-user'

export async function createAuthedAgent() {
  const { user } = await createUser()
  const token = app.jwt.sign({ sub: user?.id }, { expiresIn: '1h' })

  return request.agent(app.server).set('Authorization', `Bearer ${token}`)
}
