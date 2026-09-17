import 'dotenv/config'
import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Client } from 'pg'
import type { TestProject } from 'vitest/node'

export default async function setup(project: TestProject) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  const baseUrl = new URL(process.env.DATABASE_URL)
  const databaseName = `motostatus_test_${randomUUID().replaceAll('-', '')}`

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  await client.connect()

  await client.query(`CREATE DATABASE "${databaseName}"`)

  await client.end()

  const testDatabaseUrl = new URL(baseUrl)
  testDatabaseUrl.pathname = `/${databaseName}`

  execFileSync('bun', ['x', 'drizzle-kit', 'migrate'], {
    env: {
      ...process.env,
      DATABASE_URL: testDatabaseUrl.toString(),
    },
    stdio: 'inherit',
  })

  project.provide('databaseUrl', testDatabaseUrl.toString())

  return async () => {
    const cleanupClient = new Client({
      connectionString: process.env.DATABASE_URL,
    })

    await cleanupClient.connect()

    await cleanupClient.query(
      `DROP DATABASE IF EXISTS "${databaseName}" WITH (FORCE)`,
    )

    await cleanupClient.end()
  }
}

declare module 'vitest' {
  export interface ProvidedContext {
    databaseUrl: string
  }
}
