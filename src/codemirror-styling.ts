import { EditorView, ViewPlugin } from '@codemirror/view'
import { StateEffect, StateField } from '@codemirror/state'
import { HighlightStyle, LanguageSupport, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { pythonLanguage } from '@codemirror/lang-python'
import { pythonBuiltin } from './pythonBuiltin'

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
  // See https://github.com/jupyterlab/jupyterlab/pull/15805
  '.cm-builtin > span': {
    color: '#005CC5',
  },
  '&dark .cm-builtin > span': {
    color: '#79B8FF',
  },
})

// https://lezer.codemirror.net/docs/ref/#highlight.tags

const lightHighlight = syntaxHighlighting(HighlightStyle.define([
  { tag: t.comment, color: '#6A737D' },
  { tag: t.string, color: '#032F62' },
  { tag: [t.literal, t.null, t.brace], color: '#005CC5' },
  { tag: [t.name, t.derefOperator], color: '#24292E' },
  { tag: [t.operator, t.keyword], color: '#D73A49' },
  { tag: t.definition(t.name), color: '#6F42C1' },
], { themeType: 'light' }))

const darkHighlight = syntaxHighlighting(HighlightStyle.define([
  { tag: t.comment, color: '#6A737D' },
  { tag: t.string, color: '#9ECBFF' },
  { tag: [t.literal, t.null, t.brace], color: '#79B8FF' },
  { tag: [t.name, t.derefOperator], color: '#E1E4E8' },
  { tag: [t.operator, t.keyword], color: '#F97583' },
  { tag: t.definition(t.name), color: '#B392F0' },
], { themeType: 'dark' }))

export const styling = [
  darkMode,
  theme,
  lightHighlight,
  darkHighlight,
  new LanguageSupport(pythonLanguage, pythonBuiltin(pythonLanguage)),
]
