<script lang="ts">
let worker: Worker
let inputData: Uint8Array
let waitFlag: Int32Array

const ready = ref(false)
const encoder = new TextEncoder()
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'

const props = defineProps<{
  id: string
  code: string
}>()

const output = useLocalStorage(`editor-output-${props.id}`, '')
const running = ref(false)

let parent = ref<HTMLDivElement>()
let editor: EditorView

onMounted(() => {
  // initialize one worker per session shared by all editor instances
  if (!worker) {
    worker = new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module'
    })
    const inputBuffer = new SharedArrayBuffer(1024)
    inputData = new Uint8Array(inputBuffer)
    const waitBuffer = new SharedArrayBuffer(4)
    waitFlag = new Int32Array(waitBuffer)

    worker.addEventListener('message', () => {
      ready.value = true
      worker.postMessage({ inputBuffer, waitBuffer })
    }, { once: true })
  }
  worker.addEventListener('message', async (e) => {
    if (e.data.id !== props.id) return

    if (e.data.input) {
      // hack to allow time for Python input()'s prompt to output first
      await new Promise(r => setTimeout(r, 50))

      const inputArry = encoder.encode(prompt() ?? '')
      Atomics.store(inputData, 0, inputArry.length)
      for (let i = 0; i < inputArry.length; i++)
        Atomics.store(inputData, i + 1, inputArry[i])

      Atomics.store(waitFlag, 0, 1)
      Atomics.notify(waitFlag, 0)
      Atomics.store(waitFlag, 0, 0)
    }
    if (e.data.output) output.value += e.data.output
    if (e.data.done) running.value = false
  })
  editor = new EditorView({
    extensions: [basicSetup, python()],
    parent: parent.value!,
    doc: props.code
  })
})

function run() {
  let code = editor.state.doc.toString()
  output.value = ''
  running.value = true
  worker.postMessage({ id: props.id, code })
}
</script>

<template>
  <div ref="parent" />
  <button @click="run" :disabled="running || !ready">
    {{ ready ? (running ? 'Running...' : 'Run') : 'Loading Pyodide...' }}
  </button>
  <pre class="output"><code>{{ output }}</code></pre>
</template>

<style scoped>
pre.output {
  background-color: var(--vp-code-block-bg);
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  border-radius: 8px;
  padding: 20px 24px;
}
</style>
