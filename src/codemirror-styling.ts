import { EditorView, ViewPlugin } from '@codemirror/view'
import { StateEffect, StateField } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting, type TagStyle } from '@codemirror/language'
import { tags as t, type Tag } from '@lezer/highlight'
import githubLight from 'tm-themes/themes/github-light.json'
import githubDark from 'tm-themes/themes/github-dark.json'

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
  tmThemeToCodemirrorExtension(githubLight),
  tmThemeToCodemirrorExtension(githubDark),
]

// Converts a theme from https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes
function tmThemeToCodemirrorExtension(tm: any) {
  const specs: TagStyle[] = []
  for (const c of tm.tokenColors) {
    const tag = tmScopeToCmTag(c.scope)
    if (tag) specs.push({ tag, ...tmSettingsToCmStyle(c.settings) })
  }
  return syntaxHighlighting(HighlightStyle.define(specs, { themeType: tm.type }))
}

function tmScopeToCmTag(scope: string | string[]) {
  if (Array.isArray(scope)) {
    const tags: Tag[] = []
    for (const s of scope) {
      const tag = getLezerTag(s)
      if (tag) tags.push(tag)
    }
    return tags.length > 0 ? tags : false
  }
  return getLezerTag(scope)
}

// https://macromates.com/manual/en/language_grammars#naming-conventions
// https://lezer.codemirror.net/docs/ref/#highlight.tags
function getLezerTag(scope: string) {
  switch (scope) {
    case 'comment':
      return t.comment
    case 'keyword':
      return t.keyword
    case 'string':
      return t.string
    default:
      return false
  }
}

// Very rough and not at all fully correct or comprehensive
function tmSettingsToCmStyle(settings: any) {
  const style: any = {}
  if (settings.foreground) {
    style.color = settings.foreground
  }
  if (settings.background) {
    style.background = settings.background
  }
  if (settings.fontStyle) {
    style.fontStyle = settings.fontStyle
  }
  if (settings.fontStyle === 'italic underline') {
    style.fontStyle = 'italic'
    style.textDecoration = 'underline'
  }
  return style
}
