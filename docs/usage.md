# Usage 🛠️

Using the editor in `.md` files is similar to using fenced code blocks.

## Basic usage

To add an empty editor, write the following Markdown:

````md
```python:line-numbers
```
<Editor id="i-should-be-unique" />
````

Notice that the `<Editor>` component comes directly after a `python` fenced code block.

The language identifier for the code block must be exactly `python` and not `py`; the `:line-numbers` suffix is used to avoid a layout shift on first visit.

Each `<Editor>` component across the whole site must have a different `id`, which can be any string. This `id` is used to auto-save the editor's contents before each code run and page navigation.

This produces the following:

```python:line-numbers
```
<Editor id="i-should-be-unique" />

## Initial code content

For an editor that starts with some code, add your Python inside the code block:

````md
```python:line-numbers
def fib(n):
    if n < 0:
        raise ValueError("must be non-negative")
    elif n == 0 or n == 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

print(fib(10))
```
<Editor id="fib" />
````

This produces the following:

```python:line-numbers
def fib(n):
    if n < 0:
        raise ValueError("must be non-negative")
    elif n == 0 or n == 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

print(fib(10))
```
<Editor id="fib" />

When the `reset editor` button is pressed, the editor's contents will be reverted back to this initial code. The user can undo this with `Ctrl+Z`.

## Max height

By default, the editor has a max height of `344px`. This can be changed like so:

````md
```python:line-numbers
```
<Editor id="short" max-height="200px" />
````

This produces the following (try adding more lines):

```python:line-numbers
```
<Editor id="short" max-height="200px" />

Notice that the editor starts scrolling after ~7 lines now, instead of ~13.
