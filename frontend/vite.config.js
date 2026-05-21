import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  publicDir: 'public',
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000')
  },
  server: {
    port: 3001,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
