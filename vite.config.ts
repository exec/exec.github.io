import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works whether served from the custom-domain root
  // (qrgen.byexec.com/) or the project-page subpath (exec.github.io/qrgen/).
  base: './',
  plugins: [react(), tailwindcss()],
})
