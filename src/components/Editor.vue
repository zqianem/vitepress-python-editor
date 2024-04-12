<script lang="ts">
const ready = ref(false)
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
worker.addEventListener('message', () => ready.value = true, { once: true })
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'; 

let parent = ref<HTMLDivElement | null>(null)
let editor: EditorView | null = null

onMounted(() => {
  editor = new EditorView({
    extensions: [basicSetup, python()],
    parent: parent.value!,
    doc: `
import time
print('hey') 
time.sleep(3)
print('no')
time.sleep(3)
print('nono')
    `
  })
})

const id = crypto.randomUUID()
const output = ref('')
const running = ref(false)

worker.addEventListener('message', (e) => {
  if (e.data.id !== id) return

  if (e.data.output) output.value += `${e.data.output}\n`
  if (e.data.done) running.value = false
})

function run() {
  if (!editor) return

  let code = editor.state.doc.toString()
  output.value = ''
  running.value = true
  worker.postMessage({ id, code })
}
</script>

<template>
  <div ref="parent" />
  <button @click="run" :disabled="running || !ready">
    {{ ready ? (running ? 'Running...' : 'Run') : 'Loading Pyodide...' }}
  </button>
  <pre>{{ output }}</pre>
</template>
