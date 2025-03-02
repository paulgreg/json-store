import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/integration-tests/*.spec.js'],
    exclude: ['node_modules'],
    globals: true,
  },
})
