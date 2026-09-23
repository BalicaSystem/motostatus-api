import { compare } from 'bcryptjs'
import type { User } from '../db/schema'
import type { UsersRepository } from '../repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  userId: User['id']
  name: User['name']
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatches = await compare(password, user.passwordHash)

    if (!passwordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      userId: user.id,
      name: user.name,
    }
  }
}
