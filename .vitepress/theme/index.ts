import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Editor from 'vitepress-python-editor'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Editor', Editor)
  },
} satisfies Theme
