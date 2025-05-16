// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4002,
    strictPort: true,
    proxy: {
      // proxy all of your CRUD endpoints to :5180
      '/users':             { target: 'http://localhost:5180', changeOrigin: true },
      '/people':            { target: 'http://localhost:5180', changeOrigin: true },
      '/relationships':     { target: 'http://localhost:5180', changeOrigin: true },
      '/events':            { target: 'http://localhost:5180', changeOrigin: true },
      '/tags':              { target: 'http://localhost:5180', changeOrigin: true },
      '/relationship-tags': { target: 'http://localhost:5180', changeOrigin: true },
    }
  }
})
