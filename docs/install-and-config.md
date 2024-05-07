# Install and config 🪛

Before using the editor, take the steps detailed below.

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
    plugins: [
      vitepressPythonEditor(),
    ],
  },
})
```
:::

If your VitePress [assetsDir](https://vitepress.dev/reference/site-config#assetsdir) does not resolve to `.vitepress/dist/assets` (relative to the project root), pass the fully resolved path to the plugin like so:

::: code-group
```js{7} [.vitepress/config.js]
import { defaultConfig } from 'vitepress'
import { vitepressPythonEditor } from 'vitepress-python-editor/vite-plugin'

export defaultConfig({
  vite: {
    plugins: [
      vitepressPythonEditor({ assetsDir: 'docs/.vitepress/dist/assets' }),
    ],
  },
})
```
:::

## 3. Register global component

Next, register the editor as a [VitePress global component](https://vitepress.dev/guide/extending-default-theme#registering-global-components):

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

## 4. Set HTTP headers

Finally, on your website host, add the following headers to fulfill the [security requirements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements) for `SharedArrayBuffer`:

```HTTP
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

The exact config will vary by provider. Here are some examples:

::: code-group

```toml [netlify.toml]
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Embedder-Policy = "require-corp"
```

```json [vercel.json]
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        }
      ]
    } 
  ]
}
```

```txt [_headers]
/*
  Cross-Origin-Opener-Policy = "same-origin"
  Cross-Origin-Embedder-Policy = "require-corp"
```
:::

For details, see the specific documentation for each provider:

- [Netlify](https://docs.netlify.com/configure-builds/file-based-configuration/#headers)
- [Vercel](https://vercel.com/docs/projects/project-configuration#headers)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/)

::: tip
As of writing, [GitHub Pages](https://pages.github.com/) does not have an easy way to add these headers. It is suggested to use one of the providers above as an alternative, all of which have serviceable free plans.
:::
