import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 8000,
    open: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1'
    ]
  }
})

