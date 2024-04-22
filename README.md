# VitePress Python Editor

A code editor for the Python programming language to be used in a VitePress site.

Runs Python code locally in the browser and supports Python's `input()`.


## Installation & Usage

> [!WARNING]
> This package is still a work-in-progress; these instructions do not yet work.

```sh
npm i vitepress-python-editor
```

First, include the Vite plugin in the VitePress config:

```js
// .vitepress/config.ts

import { defaultConfig } from 'vitepress'
import { vitepressPythonEditor } from 'vitepress-python-editor/vite-plugin'

export defaultConfig({
  vite: {
    plugins: [vitepressPythonEditor()],
  },
})
```

Then, in a VitePress `.md` file, place the `<Editor>` component directly after a code block:

````md
<!-- index.html -->

<script setup>
import { Editor } from 'vitepress-python-editor'
</script>

```python:line-numbers
name = input("What's your name? ")
print(f"Hello {name}!")
```
<Editor id="hello" />
````

Ensure that the code block language is exactly `python` and that the `id` prop is present and unique among all `<Editor>` instances on your VitePress site.

The `:line-numbers` suffix can be omitted if `markdown: { lineNumbers: true }` is set in the VitePress config.


## Developing

```sh
pnpm i
pnpm dev
```

## TODO

- [ ] have better focus styles for both editor and output input
- [ ] match editor syntax highlighting with VitePress default theme
- [ ] publish this as a package
