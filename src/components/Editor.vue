<script setup lang="ts">
import type { PyodideInterface } from 'pyodide'
import { onMounted, ref, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'; 

const props = defineProps<{ pyodide: PyodideInterface }>()
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

let running = ref(false)
let output = ref('')
watch(output, () => console.log(output.value))

async function run() {
  if (!editor) return

  let code = editor.state.doc.toString()
  output.value = ''
  props.pyodide.setStdout({ batched: (out) => {
    console.log('batched')
    output.value = `${output.value}${out}\n`
  }})

  try {
    running.value = true
    await props.pyodide.runPythonAsync(code, { filename: '<editor>' })
  } catch(e) {
    if (e instanceof Error && e.constructor.name === 'PythonError') {
      let lines = e.message.split('\n')
      output.value = lines
        .slice(lines.findIndex(line => line.includes('File "<editor>"')))
        .join('\n')
    } else {
      throw(e)
    }
  } finally {
    running.value = false
  }
}
</script>

<template>
  <div ref="parent" />
  <button @click="run" :disabled="running">Run</button>
  <pre>{{ output }}</pre>
</template>
