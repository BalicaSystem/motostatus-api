import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCustomersRepository } from '../repositories/in-memory/in-memory-customers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { FetchCustomerByIdUseCase } from './fetch-customer-by-id'

let customersRepository: InMemoryCustomersRepository
let sut: FetchCustomerByIdUseCase

describe('Fetch Customer By Id Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new FetchCustomerByIdUseCase(customersRepository)
  })

  it('should be able to fetch a customer by id', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const response = await sut.execute({
      id: customer.id,
    })

    expect(response.customer).toEqual(customer)
  })

  it('should not be able to fetch a non-existing customer', async () => {
    await expect(
      sut.execute({
        id: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
