import { defineConfig } from 'vite'

export default defineConfig({
  base: '/diagramaker/',
  root: 'app',
  build: {
    outDir: '../dist',
  }
})
