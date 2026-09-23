import { hashSync } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate with valid credentials', async () => {
    await usersRepository.create({
      name: 'Admin',
      email: 'admin@motostatus.com.br',
      passwordHash: hashSync('MotoStatus@2026!', 6),
    })

    const response = await sut.execute({
      email: 'admin@motostatus.com.br',
      password: 'MotoStatus@2026!',
    })

    expect(response.userId).toEqual(expect.any(String))
    expect(response.name).toEqual('Admin')
  })

  it('should not be able to authenticate with an unknown email', async () => {
    await expect(
      sut.execute({
        email: 'unknown@motostatus.com.br',
        password: 'MotoStatus@2026!',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with a wrong password', async () => {
    await usersRepository.create({
      name: 'Admin',
      email: 'admin@motostatus.com.br',
      passwordHash: hashSync('MotoStatus@2026!', 6),
    })

    await expect(
      sut.execute({
        email: 'admin@motostatus.com.br',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
