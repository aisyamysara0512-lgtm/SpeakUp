import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configure SpeakUp on a dedicated unique port: 5174
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true
  }
})
