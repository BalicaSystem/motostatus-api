import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/http/controllers/**/*.test.ts'],
    globalSetup: ['./src/test/setup/database.ts'],
    setupFiles: ['./src/test/setup/env.ts'],
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1,
  },
})
