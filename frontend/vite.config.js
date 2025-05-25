// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4015,
    strictPort: true,
    proxy: {
      '/users':             { target: 'http://localhost:5182', changeOrigin: true },
      '/people':            { target: 'http://localhost:5182', changeOrigin: true },
      '/relationships':     { target: 'http://localhost:5182', changeOrigin: true },
      '/events':            { target: 'http://localhost:5182', changeOrigin: true },
      '/tags':              { target: 'http://localhost:5182', changeOrigin: true },
      '/relationship-tags': { target: 'http://localhost:5182', changeOrigin: true },
      '/reset-all': { target: 'http://localhost:5182', changeOrigin: true },
      '/delete-sample-player': { target: 'http://localhost:5182', changeOrigin: true },
    }
  }
});
