<script setup lang="ts">
import Editor from './components/Editor.vue'
import { ref } from 'vue'
import { type PyodideInterface, loadPyodide } from 'pyodide'

let pyodide = ref<PyodideInterface | null>(null);
(async () => pyodide.value = await loadPyodide())()
</script>

<template>
  <Editor v-if="pyodide" :pyodide />
  <template v-else>Loading...</template>
</template>
