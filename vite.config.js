import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.spec.js'],
    exclude: ['node_modules', 'src/integration-tests'],
    globals: true,
  },
})
