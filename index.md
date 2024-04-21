# Demo

<script setup>
import Editor from './src/Editor.vue'
</script>

## Hello world

```py
name = input("What's your name? ")

if name:
  print(f"Hello {name}!")
else:
  print(f"Hello stranger!")
```
<Editor id="hello" />

## Tick tock

```py
import time

for i in range(6):
  if i % 2 == 0:
    print('tick')
  else:
    print('tock')
  time.sleep(1)
```
<Editor id="clock" />

## Infinite loop

```py
x = 0
while True:
  x = x + 1
  # print(x) # uncommenting this line makes "stop running" fail
```
<Editor id="loop" />

See https://github.com/pyodide/pyodide/discussions/4595 for details.
