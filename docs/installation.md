# Installation

Installing **VitePress Python Editor** requires a few steps, each detailed below.

## 1. Add dependency

First, add [`vitepress-python-editor`](https://www.npmjs.com/package/vitepress-python-editor) as a dependency:

::: code-group
```sh [npm]
npm install vitepress-python-editor
```

```sh [yarn]
yarn add vitepress-python-editor
```

```sh [pnpm]
pnpm add vitepress-python-editor
```

```sh [bun]
bun add vitepress-python-editor
```
:::

## 2. Configure Vite plugin

Then, add the [Vite plugin](https://vitejs.dev/guide/using-plugins.html) to your [VitePress config](https://vitepress.dev/reference/site-config#site-config) like so:

::: code-group
```js [.vitepress/config.js]
import { defaultConfig } from 'vitepress'
import { vitepressPythonEditor } from 'vitepress-python-editor/vite-plugin'

export defaultConfig({
  vite: {
    plugins: [vitepressPythonEditor()],
  },
})
```

```ts [.vitepress/config.ts]
import { defaultConfig } from 'vitepress'
import { vitepressPythonEditor } from 'vitepress-python-editor/vite-plugin'

export defaultConfig({
  vite: {
    plugins: [vitepressPythonEditor()],
  },
})
```
:::

## 3. Register global component

Finally, register the editor as a [VitePress global component](https://vitepress.dev/guide/extending-default-theme#registering-global-components):

::: code-group
```js [.vitepress/theme/index.js]
import DefaultTheme from 'vitepress/theme'
import Editor from 'vitepress-python-editor'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Editor', Editor)
  },
}
```

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import Editor from 'vitepress-python-editor'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Editor', Editor)
  },
} satisfies Theme
```
:::

This avoids the need to import the editor with a `<script setup>` block in each `.md` file.
