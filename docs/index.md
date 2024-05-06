# What is this?

**VitePress Python Editor** is a UI component for the [VitePress](https://vitepress.dev/) static site generator that enables editing and running [Python](https://www.python.org/) programs locally in the browser, originally developed to teach students how to code.

It is implemented in [Vue](https://vuejs.org/) using [CodeMirror](https://codemirror.net/) and [Pyodide](https://pyodide.org/).

## Try it out!

::: details Note to keyboard navigation users
To move focus out of the editor, press `Escape` before `Tab` or `Shift-Tab`.

By default, `Tab` and `Shift-Tab` will indent and dedent the code, respectively.
:::

Edit the code and press the play button ▶️:

```python:line-numbers
# Change this to say "Hello world!"
print("Hello!")
```
<Editor id="hello" />

Support for Python's `input()` is built-in:

```python:line-numbers
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
- Handles the Tab key in an accessible way ([CodeMirror docs](https://codemirror.net/examples/tab/))
- Undo and redo changes via `Ctrl+Z` and `Ctrl+Shift+Z` keyboard shortcuts

## Next steps

- [Install & Config](/install-and-config): steps to begin adding the editor to your own VitePress project
- [Usage](/usage):  see how the editor is invoked from within `.md` files
