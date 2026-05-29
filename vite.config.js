import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// `base` matches the GitHub Pages project URL: https://<user>.github.io/coverpennywebsite/
export default defineConfig({
  base: '/coverpennywebsite/',
  plugins: [react()],
})
