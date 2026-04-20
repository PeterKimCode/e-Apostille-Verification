import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a production base when building for GitHub Pages so asset paths are correct.
const base = process.env.NODE_ENV === 'production' ? '/e-Apostille-Verification/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173
  }
})
