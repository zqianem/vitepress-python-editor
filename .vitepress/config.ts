import { defineConfig } from 'vitepress'
import { copyFile, mkdir } from 'fs/promises'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Python Editor",
  description: "A VitePress Component",
  srcExclude: ['README.md'],
  markdown: {
    lineNumbers: true
  },
  vite: {
    build: {
      target: 'esnext'
    },
    worker: {
      format: 'es'
    },
    optimizeDeps: {
      exclude: ['pyodide']
    },
    plugins: [
      {
        name: 'allow SharedArrayBuffer',
        configureServer(server) {
          server.middlewares.use((_req, res, next) => {
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
            next();
          })
        }
      },
      // https://pyodide.org/en/latest/usage/working-with-bundlers.html#vite
      {
        name: 'pyodide',
        generateBundle: async () => {
          await mkdir('.vitepress/dist/assets', { recursive: true })
          const files = [
            'pyodide-lock.json',
            'pyodide.asm.js',
            'pyodide.asm.wasm',
            'python_stdlib.zip'
          ]
          for (const file of files) {
            await copyFile(`node_modules/pyodide/${file}`, `.vitepress/dist/assets/${file}`)
          }
        }
      }
    ]
  }
})
