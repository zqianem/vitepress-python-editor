import { copyFile, mkdir } from 'fs/promises'
import { join } from 'path'

export function vitepressPythonEditor(
  { assetsDir } = { assetsDir: '.vitepress/dist/assets' }
) {
  return {
    name: 'vite-plugin-vitepress-python-editor',
    config: () => ({
      build: {
        target: 'esnext',
      },
      worker: {
        format: 'es',
      },
      optimizeDeps: {
        exclude: ['pyodide'],
      },
    }),
    configureServer: (server) => {
      server.middlewares.use((_, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
        next()
      })
    },
    generateBundle: async () => {
      await mkdir(assetsDir, { recursive: true })
      const files = [
        'pyodide-lock.json',
        'pyodide.asm.js',
        'pyodide.asm.wasm',
        'python_stdlib.zip'
      ]
      const pyodideDir = join(
        'node_modules',
        'vitepress-python-editor',
        'node_modules',
        'pyodide',
      )
      for (const file of files) {
        await copyFile(join(pyodideDir, file), join(assetsDir, file))
      }
    },
  }
}
