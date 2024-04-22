import { defineConfig } from 'vitepress'
import { vitepressPythonEditor } from '../src/vite-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Python Editor",
  description: "A VitePress Component",
  srcExclude: ['README.md'],
  markdown: {
    lineNumbers: true
  },
  vite: {
    plugins: [vitepressPythonEditor()],
  },
})
