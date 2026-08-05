import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'react-vendor'
          }
        },
      },
    },
  },
  server: {
    allowedHosts: [
      'preciously-nonnescient-isabel.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.io',
    ],
  },
})
