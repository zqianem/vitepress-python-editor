import { EditorView, ViewPlugin } from '@codemirror/view'
import { StateEffect, StateField } from '@codemirror/state'
import { HighlightStyle, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'

const isDark = () => document.documentElement.classList.contains('dark')

const darkModeUpdate = StateEffect.define<boolean>()

const darkModeWatcher = ViewPlugin.define((view) => {
  const observer = new MutationObserver(() =>
    view.dispatch({ effects: darkModeUpdate.of(isDark()) })
  )
  observer.observe(document.documentElement, { attributeFilter: ['class'] })
  return { destroy: () => observer.disconnect() }
})

const darkMode = StateField.define<boolean>({
  create: () => isDark(),
  update: (value, transaction) => {
    for (const effect of transaction.effects) if (effect.is(darkModeUpdate)) return effect.value
    return value
  },
  provide: (field) => [EditorView.darkTheme.from(field), darkModeWatcher]
})

const theme = EditorView.baseTheme({
  '&': {
    fontSize: 'var(--vp-code-font-size)',
    backgroundColor: 'var(--vp-code-block-bg)',
    borderRadius: '8px',
  },
  '.cm-content': {
    padding: '20px 0',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--vp-code-block-bg)',
    borderRight: '1px solid var(--vp-code-block-divider-color)',
    width: '32px',
    justifyContent: 'center',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  '.cm-line': {
    padding: '0 72px 0 20px',
    lineHeight: 'var(--vp-code-line-height)',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--vp-code-line-highlight-color)',
  },
  '&dark .cm-cursor': {
    borderLeftColor: 'white',
  },
})

export const styling = [
  darkMode,
  theme,
  syntaxHighlighting(HighlightStyle.define(defaultHighlightStyle.specs, { themeType: 'light' })),
  syntaxHighlighting(HighlightStyle.define(oneDarkHighlightStyle.specs, { themeType: 'dark' }))
]
