<script setup lang="ts">
import type { PyodideInterface } from 'pyodide'
import { onMounted, ref } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'; 

const props = defineProps<{ pyodide: PyodideInterface }>()
let parent = ref<HTMLDivElement | null>(null)
let editor: EditorView | null = null

onMounted(() => {
  editor = new EditorView({
    extensions: [basicSetup, python()],
    parent: parent.value!,
    doc: `print('hello world')`
  })
})

let running = ref(false)

async function run() {
  if (!editor) return

  let code = editor.state.doc.toString()
  running.value = true
  try {
    await props.pyodide.runPythonAsync(code)
  } finally {
    running.value = false
  }
}
</script>

<template>
  <div ref="parent" />
  <button @click="run" :disabled="running">Run</button>
</template>
