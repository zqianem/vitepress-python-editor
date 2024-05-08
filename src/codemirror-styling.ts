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
      if (tag) Array.isArray(tag) ? tags.push(...tag) : tags.push(tag)
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
    case 'comment.line':
    case 'comment.line.double-slash':
    case 'comment.line.double-dash':
    case 'comment.line.number-sign':
    case 'comment.line.percentage':
      return t.lineComment
    case 'comment.block':
      return t.blockComment
    case 'comment.block.documentation':
      return t.docComment
    case 'constant':
      return t.literal
    case 'constant.numeric':
      return t.number
    case 'constant.character':
      return t.character
    case 'constant.character.escape':
      return t.escape
    case 'constant.language':
      return t.bool
    case 'constant.other':
      return t.color
    // case 'entity':
    case 'entity.name':
      // return t.name
    case 'entity.name.function':
      return t.function(t.name)
    case 'entity.name.type':
      return [t.typeName, t.className]
    case 'entity.name.tag':
      return t.tagName
    // case 'entity.name.section':
    // case 'entity.other':
    case 'entity.other.inherited-class':
      return t.className
    case 'entity.other.attribute-name':
      return t.attributeName
    case 'invalid':
    case 'invalid.illegal':
    case 'invalid.deprecated':
      return t.invalid
    case 'keyword':
      return t.keyword
    case 'keyword.control':
      return t.controlKeyword
    case 'keyword.operator':
      return [t.operator]
    case 'keyword.other':
      return [t.definitionKeyword, t.moduleKeyword]
    case 'meta':
      return t.meta
    case 'markup':
      return t.content
    case 'markup.underline':
    case 'markup.underline.link':
      return t.link
    case 'markup.bold':
      return t.strong
    case 'markup.heading':
      return t.heading
    case 'markup.italic':
      return t.emphasis
    case 'markup.list':
    case 'markup.list.numbered':
    case 'markup.list.unnumbered':
      return t.list
    case 'markup.quote':
      return t.quote
    case 'markup.raw':
      return t.monospace
    // case 'markup.other':
    // case 'storage':
    // case 'storage.type':
    // case 'storage.modifier':
    case 'string':
    case 'string.quoted':
    case 'string.quoted.single':
    case 'string.quoted.double':
      return t.string
    case 'string.quoted.triple':
      return t.docString
    // case 'string.quoted.other':
    // case 'string.unquoted':
    // case 'string.interpolated':
    case 'string.regexp':
      return t.regexp
    // case 'string.other':
    case 'support':
    case 'support.function':
      return t.standard(t.function(t.name))
    case 'support.class':
      return t.standard(t.className)
    case 'support.type':
      return t.standard(t.typeName)
    case 'support.constant':
      return t.standard(t.literal)
    case 'support.variable':
    case 'support.other':
      return t.standard(t.name)
    // case 'variable':
    case 'variable.parameter':
      return t.function(t.keyword)
    case 'variable.language':
      return t.self
    case 'variable.other':
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
