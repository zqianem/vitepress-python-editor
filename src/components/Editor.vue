<script setup lang="ts">
import type { PyodideInterface } from 'pyodide'
import { onMounted } from 'vue'

const props = defineProps<{ pyodide: PyodideInterface }>()

onMounted(() => {
  props.pyodide.runPythonAsync("1+1").then((result) => {
    console.log("Python says that 1+1 =", result);
  });
})
</script>

<template></template>
