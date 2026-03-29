import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      // Proxy API requests to the backend running on port 1234
      "/api": {
        target: "http://localhost:1236",
        changeOrigin: true,
      },
      "/ws": {
        target: "http://localhost:1236",
        ws: true,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 2000,
  }
})
