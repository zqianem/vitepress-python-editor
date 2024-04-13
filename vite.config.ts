import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // needed to use SharedArrayBuffer
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  worker: {
    format: 'es'
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [pyodide()]
    }
  },
  optimizeDeps: {
    exclude: ['pyodide']
  }
})

import { copyFile, mkdir } from 'fs/promises'

// https://pyodide.org/en/latest/usage/working-with-bundlers.html#vite
function pyodide() {
  return {
    name: 'pyodide',
    generateBundle: async () => {
      await mkdir('dist/assets', { recursive: true })
      const files = [
        'pyodide-lock.json',
        'pyodide.asm.js',
        'pyodide.asm.wasm',
        'python_stdlib.zip'
      ]
      for (const file of files) {
        await copyFile(`node_modules/pyodide/${file}`, `dist/assets/${file}`)
      }
    }
  }
}
