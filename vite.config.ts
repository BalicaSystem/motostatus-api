import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: [
      'src/http/controllers/**/*.test.ts',
      'src/jobs/**/*.e2e.test.ts',
    ],
  },
})
