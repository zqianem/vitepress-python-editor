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
