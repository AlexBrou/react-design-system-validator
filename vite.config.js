import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { designSource } from './design-rules/vite-plugin-source.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [designSource(), react()],
})
