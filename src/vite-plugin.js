import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

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
        'python_stdlib.zip',
      ]
      for (const file of files) {
        await copyFile(
          join('node_modules/pyodide', file),
          join(assetsDir, file),
        )
      }
    },
    transform(src, id) {
      if (id.endsWith('pyodide-worker.js?worker_file&type=module')) {
        return {
          code: src.replace(
            '/* to be transformed by vite-plugin-vitepress-python-editor */',
            '"click"'
          ),
          map: null,
        }
      }
    }
  }
}
