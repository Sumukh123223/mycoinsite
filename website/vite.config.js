import { defineConfig } from 'vite'

// Base path for GitHub Pages (adjust if your repo name is different)
const base = process.env.NODE_ENV === 'production' ? '/mycoinsite/' : '/'

export default defineConfig({
  base: base,
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

