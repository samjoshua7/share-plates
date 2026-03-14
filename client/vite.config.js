import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "shareplates-api.onrender.com", // for renderer server -- only for publishing
        //target: "http://localhost:5000", // for local development -- use for testing and building
        changeOrigin: true
      },
      "/socket.io": {
        target: "shareplates-api.onrender.com", // for renderer server -- only for publishing
        //target: "http://localhost:5000", // for local development -- use for testing and building
        ws: true
      }
    }
  }
})