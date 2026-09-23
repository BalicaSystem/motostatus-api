import { inject } from 'vitest'

process.env.DATABASE_URL = inject('databaseUrl')
process.env.JWT_SECRET ??= 'test-secret-8f2c1d9e3a7b4c5d6e7f8a9b0c1d2e3f'
