# A Python editor running locally in a browser

Implemented as a Vue component (CodeMirror + Pyodide) intended for use in a VitePress site.

```sh
pnpm i
pnpm dev
```

## TODO

- [ ] use `<dialog>` instead of `prompt()` for `input()`
- [ ] auto-save editor content to `localStorage`
- [ ] terminate and restart worker if interrupts don't stop in time
- [ ] try to use slot instead of prop for `code`
- [ ] publish this as a package
