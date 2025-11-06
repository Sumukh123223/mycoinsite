import { defineConfig } from 'vite'

// Base path for GitHub Pages
// If your site is at username.github.io/repo-name, use '/repo-name/'
// If your site is at username.github.io, use '/'
const base = process.env.GITHUB_PAGES_BASE || (process.env.NODE_ENV === 'production' ? '/mycoinsite/' : '/')

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

