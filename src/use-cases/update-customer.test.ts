import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCustomersRepository } from '../repositories/in-memory/in-memory-customers-repository'
import { CustomerAlreadyExistsError } from './errors/customer-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UpdateCustomerUseCase } from './update-customer'

let customersRepository: InMemoryCustomersRepository
let sut: UpdateCustomerUseCase

describe('Update Customer Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new UpdateCustomerUseCase(customersRepository)
  })

  it('should be able to update a customer', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const response = await sut.execute({
      id: customer.id,
      name: 'João da Silva',
      document: '98765432100',
      city: 'Fortaleza',
    })

    expect(response.customer).toEqual(
      expect.objectContaining({
        id: customer.id,
        name: 'João da Silva',
        document: '98765432100',
        city: 'Fortaleza',
      }),
    )
  })

  it('should be able to update only the name', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const response = await sut.execute({
      id: customer.id,
      name: 'João da Silva',
    })

    expect(response.customer.name).toBe('João da Silva')
    expect(response.customer.document).toBe('12345678900')
    expect(response.customer.city).toBe('Sobral')
  })

  it('should be able to update only the document', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const response = await sut.execute({
      id: customer.id,
      document: '98765432100',
    })

    expect(response.customer.document).toBe('98765432100')
    expect(response.customer.name).toBe('João Silva')
    expect(response.customer.city).toBe('Sobral')
  })

  it('should be able to update only the city', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const response = await sut.execute({
      id: customer.id,
      city: 'Fortaleza',
    })

    expect(response.customer.city).toBe('Fortaleza')
    expect(response.customer.name).toBe('João Silva')
    expect(response.customer.document).toBe('12345678900')
  })

  it('should be able to keep the same document', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const response = await sut.execute({
      id: customer.id,
      name: 'João da Silva',
      document: customer.document,
    })

    expect(response.customer.document).toBe('12345678900')
    expect(response.customer.name).toBe('João da Silva')
  })

  it('should not be able to update a non-existing customer', async () => {
    await expect(
      sut.execute({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'João da Silva',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update with an existing document', async () => {
    const firstCustomer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const secondCustomer = await customersRepository.create({
      name: 'Maria Silva',
      document: '98765432100',
      city: 'Fortaleza',
    })

    await expect(
      sut.execute({
        id: secondCustomer.id,
        document: firstCustomer.document,
      }),
    ).rejects.toBeInstanceOf(CustomerAlreadyExistsError)
  })
})
