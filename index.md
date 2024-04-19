# Demo

<script setup>
import Editor from './src/Editor.vue'

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

const loop = `
x = 0
while True:
  x = x + 1
  # print(x) # uncommenting this line makes "stop running" fail

`.trim()
</script>

## Hello world

<Editor id="hello" :code="hello" />


## Tick tock

<Editor id="clock" :code="clock" />

## Infinite loop

<Editor id="loop" :code="loop" />

See https://github.com/pyodide/pyodide/discussions/4595 for details.
