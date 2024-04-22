import { defineConfig } from 'vitepress'
import { vitepressPythonEditor } from 'vitepress-python-editor/vite-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'VitePress Python Editor',
  head: [['link', { rel: 'icon', href: '/vitepress-logo-mini.svg' }]],
  srcExclude: ['README.md'],
  markdown: {
    lineNumbers: true,
  },
  vite: {
    plugins: [vitepressPythonEditor()],
  },
})
