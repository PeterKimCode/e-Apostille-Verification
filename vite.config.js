import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use root-relative assets so the app works on the custom domain.
  base: '/',
  plugins: [react()],
  server: {
    port: 5173
  }
})
