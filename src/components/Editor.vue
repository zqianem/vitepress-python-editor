<script lang="ts">
const ready = ref(false)
const inputBuffer = new SharedArrayBuffer(1024)
const inputData = new Uint8Array(inputBuffer)
const waitBuffer = new SharedArrayBuffer(4)
const waitFlag = new Int32Array(waitBuffer)
const encoder = new TextEncoder()

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module'
})

worker.addEventListener('message', () => {
  ready.value = true
  worker.postMessage({ inputBuffer, waitBuffer })
}, { once: true })
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'; 

const props = defineProps<{ code: string }>()

let parent = ref<HTMLDivElement | null>(null)
let editor: EditorView | null = null

onMounted(() => {
  editor = new EditorView({
    extensions: [basicSetup, python()],
    parent: parent.value!,
    doc: props.code
  })
})

const id = crypto.randomUUID()
const output = ref('')
const running = ref(false)

worker.addEventListener('message', async (e) => {
  if (e.data.id !== id) return

  if (e.data.input) {
    // hack to allow time for Python input()'s prompt to output first
    await new Promise(r => setTimeout(r, 50)) 

    const inputText = encoder.encode(prompt() ?? '')
    for (let i = 0; i < inputData.length; i++)
      Atomics.store(inputData, i, inputText[i])

    Atomics.store(waitFlag, 0, 1) 
    Atomics.notify(waitFlag, 0)
    Atomics.store(waitFlag, 0, 0)
  }
  if (e.data.output) output.value += e.data.output
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
