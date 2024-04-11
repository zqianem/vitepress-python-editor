<script setup lang="ts">
import { loadPyodide } from "pyodide";

async function hello_python() {
  let pyodide = await loadPyodide();
  return pyodide.runPythonAsync("1+1");
}

hello_python().then((result) => {
  console.log("Python says that 1+1 =", result);
});
</script>

<template></template>
