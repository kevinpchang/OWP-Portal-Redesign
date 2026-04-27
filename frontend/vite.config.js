import { fileURLToPath, URL } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),

    reporters: ['default', 'junit'],
    outputFile: {
      junit: '../test-results/vitest-results.xml',
    },

    coverage: {
      reportsDirectory: '../test-results/vitest-coverage',
      reporter: ['text', 'html', 'json'],
    },
  },
})
