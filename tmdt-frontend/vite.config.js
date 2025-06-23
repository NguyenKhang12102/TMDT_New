import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ⚠️ Thêm cấu hình proxy ở đây
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // ⚠️ PORT Spring Boot
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
