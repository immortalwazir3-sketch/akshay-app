import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [
    react(),
    process.env.NODE_ENV !== 'production' && mkcert()
  ].filter(Boolean),
  server: process.env.NODE_ENV !== 'production' ? {
    https: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  } : {},
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})