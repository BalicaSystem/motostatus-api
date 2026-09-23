import { DrizzleUsersRepository } from '../../repositories/drizzle/drizzle-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new DrizzleUsersRepository()

  return new AuthenticateUseCase(usersRepository)
}
