import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCustomersRepository } from '../repositories/in-memory/in-memory-customers-repository'
import { FetchCustomersUseCase } from './fetch-customers'
import { db } from '../db'
import { customers, motorcycles, orderItems, orders } from '../db/schema'

let customersRepository: InMemoryCustomersRepository
let sut: FetchCustomersUseCase

describe('Fetch Customers Use Case', () => {
  beforeEach(async () => {
    await db.delete(orderItems)
    await db.delete(orders)
    await db.delete(customers)
    await db.delete(motorcycles)

    customersRepository = new InMemoryCustomersRepository()
    sut = new FetchCustomersUseCase(customersRepository)
  })

  it('should be able to fetch customers', async () => {
    await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    await customersRepository.create({
      name: 'Maria Silva',
      document: '98765432100',
      city: 'Fortaleza',
    })

    const response = await sut.execute({})

    expect(response.customers).toHaveLength(2)
    expect(response.page).toBe(1)
    expect(response.perPage).toBe(20)
    expect(response.total).toBe(2)
    expect(response.totalPages).toBe(1)
  })

  it('should be able to fetch customers with pagination', async () => {
    await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    await customersRepository.create({
      name: 'Maria Silva',
      document: '98765432100',
      city: 'Fortaleza',
    })

    await customersRepository.create({
      name: 'Pedro Silva',
      document: '45678912300',
      city: 'Caucaia',
    })

    const response = await sut.execute({
      page: 1,
      perPage: 2,
    })

    expect(response.customers).toHaveLength(2)
    expect(response.page).toBe(1)
    expect(response.perPage).toBe(2)
    expect(response.total).toBe(3)
    expect(response.totalPages).toBe(2)
  })

  it('should be able to fetch the second page', async () => {
    await customersRepository.create({
      name: 'João Silva',
      document: '12345678900',
      city: 'Sobral',
    })

    await customersRepository.create({
      name: 'Maria Silva',
      document: '98765432100',
      city: 'Fortaleza',
    })

    await customersRepository.create({
      name: 'Pedro Silva',
      document: '45678912300',
      city: 'Caucaia',
    })

    const response = await sut.execute({
      page: 2,
      perPage: 2,
    })

    expect(response.customers).toHaveLength(1)
    expect(response.page).toBe(2)
    expect(response.total).toBe(3)
    expect(response.totalPages).toBe(2)
  })

  it('should use default pagination values', async () => {
    const response = await sut.execute({})

    expect(response.page).toBe(1)
    expect(response.perPage).toBe(20)
  })
})
