
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/202f-academy-web/',
  server: { port: 5173, open: true },
})

  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/academy/202f-academy-web/', //
})
