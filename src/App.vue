<script setup lang="ts">
import Editor from './components/Editor.vue'

const code = `\
name = input("What's your name? ")
print(f"Hello {name}!")`
</script>

<template>
  <Editor :code />
</template>
