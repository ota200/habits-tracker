import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "https://ota200.github.io/habits-tracker/",
  plugins: [react()],
})
