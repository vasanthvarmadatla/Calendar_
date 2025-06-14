// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Calendar_/', // 👈 important
  plugins: [react()],
})
