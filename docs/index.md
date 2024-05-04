# What is this?

<script setup>
import Editor from 'vitepress-python-editor'
</script>

The **VitePress Python Editor** is a UI component for the [VitePress](https://vitepress.dev/) static site generator that enables editing and running [Python](https://www.python.org/) programs locally in the browser, originally developed to teach students how to code.

It is implemented in [Vue](https://vuejs.org/) using [CodeMirror](https://codemirror.net/) and [Pyodide](https://pyodide.org/).

## A quick demo

Try it out! Edit the code and press the play button (▶️) below:

```python
# Change this to say "Hello world!"
print("Hello!")
```
<Editor id="hello" />

Support for Python's `input()` is built-in:

```python
name = input("What's your name? ")

if name:
    print(f"Hello {name}!")
else:
    print(f"Hello stranger!")
```
<Editor id="hello input" />

Visit the [Examples](/examples) page for more demos.

## Additional features

- Auto-saves editor changes to [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) before leaving page and each run
- Runs in a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) to avoid blocking the main UI thread
- Shares one Pyodide instance across multiple editors in a session for fast loading times

## Next steps

If this all sounds good to you, head on over to the [Installation](/installation) page.
