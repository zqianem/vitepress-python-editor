<script setup lang="ts">
import Editor from './components/Editor.vue'

const hello = `
name = input("What's your name? ")
if name:
  print(f"Hello {name}!")
else:
  print(f"Hello stranger!")

`.trim()

const clock = `
import time

for i in range(6):
  if i % 2 == 0:
    print('tick')
  else:
    print('tock')
  time.sleep(1)

`.trim()
</script>

<template>
  <Editor :code="hello" />
  <Editor :code="clock" />
</template>
