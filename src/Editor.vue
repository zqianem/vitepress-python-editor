<script lang="ts">
let worker: Worker
let inputData: Uint8Array
let waitFlag: Int32Array

const ready = ref(false)
const encoder = new TextEncoder()
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EditorView, minimalSetup } from 'codemirror'
import { lineNumbers, highlightActiveLine } from '@codemirror/view'
import { python } from '@codemirror/lang-python'

const props = defineProps<{
  id: string
  code: string
}>()

const output = ref('')
const running = ref(false)

let parent = ref<HTMLDivElement>()
let editor: EditorView

const theme = EditorView.theme({
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
    padding: '0 20px',
    lineHeight: 'var(--vp-code-line-height)',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--vp-code-line-highlight-color)'
  }
})

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
    extensions: [
      minimalSetup,
      highlightActiveLine(),
      lineNumbers(),
      python(),
      theme,
    ],
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

function buttonText() {
  return ready.value ? (running.value ? 'Running code...' : 'Run code') : 'Loading Pyodide...'
}
</script>

<template>
  <div class="wrapper">
    <div ref="parent" />
    <button class="run" @click="run" :disabled="running || !ready" :title="buttonText()">
      <span class="sr-only">{{ buttonText() }}</span>
      <svg v-if="running" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>
      <svg v-else-if="ready" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>
    </button>
    <pre class="output"><code>{{ output }}</code></pre>
  </div>
</template>

<style scoped>
div.wrapper {
  position: relative;
}

button.run {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 1px solid var(--vp-code-copy-code-border-color);
  border-radius: 4px;
  background-color: var(--vp-code-copy-code-bg);
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--vp-c-brand-1);
}

button.run:hover {
  color: var(--vp-c-brand-2);
  background-color: var(--vp-code-copy-code-hover-bg);
  border: 1px solid var(--vp-code-copy-code-hover-border-color);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

pre.output {
  background-color: var(--vp-code-block-bg);
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  border-radius: 8px;
  padding: 20px 24px;
  min-height: calc(var(--vp-code-line-height) * 1em);
  box-sizing: content-box;
}
</style>
