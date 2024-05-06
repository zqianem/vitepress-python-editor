import { defineConfig } from 'vitepress'
import { vitepressPythonEditor } from 'vitepress-python-editor/vite-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'VitePress Python Editor',
  description: 'Docs and demos for vitepress-python-editor',
  head: [['link', { rel: 'icon', href: '/vitepress-logo-mini.svg' }]],
  cleanUrls: true,
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
      { text: 'Install & Config', link: '/install-and-config' },
      { text: 'Usage', link: '/usage' },
      { text: 'Examples', link: '/examples' },
    ],
  },
})
