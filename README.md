# VitePress Python Editor

A code editor for the Python programming language for use in a VitePress site.

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

The code block language must be exactly `python` and the `id` prop is required and should be unique among multiple `<Editor>` instances.

The `:line-numbers` suffix is used to prevent layout shifts on load and can be omitted by setting `markdown: { lineNumbers: true }` in the VitePress config.


## Developing

```sh
pnpm i
pnpm dev
```

## TODO

- [ ] have better focus styles for both editor and output input
- [ ] match editor syntax highlighting with VitePress default theme
- [ ] publish this as a package
