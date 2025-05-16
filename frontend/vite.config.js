// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4003,
    strictPort: true,
    proxy: {
      // proxy all of your CRUD endpoints to :5181
      '/users':             { target: 'http://localhost:5181', changeOrigin: true },
      '/people':            { target: 'http://localhost:5181', changeOrigin: true },
      '/relationships':     { target: 'http://localhost:5181', changeOrigin: true },
      '/events':            { target: 'http://localhost:5181', changeOrigin: true },
      '/tags':              { target: 'http://localhost:5181', changeOrigin: true },
      '/relationship-tags': { target: 'http://localhost:5181', changeOrigin: true },
    }
  }
})
