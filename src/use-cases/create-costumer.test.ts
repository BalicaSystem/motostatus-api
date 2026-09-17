import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCustomersRepository } from '../repositories/in-memory/in-memory-customers-repository'
import { CustomerAlreadyExistsError } from './errors/customer-already-exists-error'
import { CreateCustomerUseCase } from './create-customer'

let customersRepository: InMemoryCustomersRepository
let sut: CreateCustomerUseCase

describe('Create Customer Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new CreateCustomerUseCase(customersRepository)
  })

  it('should be able to create a customer', async () => {
    const { customer } = await sut.execute({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    expect(customer.id).toEqual(expect.any(String))
    expect(customer.name).toBe('João Silva')
    expect(customer.document).toBe('12345678900')
    expect(customer.city).toBe('Sobral')
  })

  it('should not be able to create a customer with an existing document', async () => {
    await sut.execute({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    await expect(
      sut.execute({
        name: 'Maria Silva',
        document: '12345678900',
        city: 'Fortaleza',
      }),
    ).rejects.toBeInstanceOf(CustomerAlreadyExistsError)
  })

  it('should allow different customers with different documents', async () => {
    const first = await sut.execute({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    const second = await sut.execute({
      name: 'Maria Silva',
      document: '98765432100',
      city: 'Fortaleza',
    })

    expect(first.customer.id).not.toBe(second.customer.id)
    expect(customersRepository.items).toHaveLength(2)
  })
})
