import { defineConfig } from 'vitepress'
import { vitepressPythonEditor } from 'vitepress-python-editor/vite-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'VitePress Python Editor',
  head: [['link', { rel: 'icon', href: '/vitepress-logo-mini.svg' }]],
  srcDir: 'docs',
  vite: {
    plugins: [vitepressPythonEditor()],
  },
  themeConfig: {
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zqianem/vitepress-python-editor' }
    ],
    sidebar: [
      { text: 'What is this?', link: '/' },
      { text: 'Installation', link: '/installation' },
      { text: 'Usage', link: '/usage' },
      { text: 'Configuration', link: '/configuration' },
      { text: 'Examples', link: '/examples' },
    ],
  },
})
