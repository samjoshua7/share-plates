import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // for renderer server -- only for publishing
        //target: "http://localhost:5000", // for local development -- use for testing and building
        changeOrigin: true
      },
      "/socket.io": {
        target: "http://localhost:5000", // for renderer server -- only for publishing
        //target: "http://localhost:5000", // for local development -- use for testing and building
        ws: true
      }
    }
  }
})