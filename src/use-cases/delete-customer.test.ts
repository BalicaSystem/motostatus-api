import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCustomersRepository } from '../repositories/in-memory/in-memory-customers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { DeleteCustomerUseCase } from './delete-customer'

let customersRepository: InMemoryCustomersRepository
let sut: DeleteCustomerUseCase

describe('Delete Customer Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new DeleteCustomerUseCase(customersRepository)
  })

  it('should be able to delete a customer', async () => {
    const customer = await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    await sut.execute({
      id: customer.id,
    })

    const deletedCustomer = await customersRepository.findById(customer.id)

    expect(deletedCustomer).toBeNull()
  })

  it('should not be able to delete a non-existing customer', async () => {
    await expect(
      sut.execute({
        id: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
