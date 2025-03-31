import { loadPyodide } from 'pyodide'

const packages = [/* to be transformed by vite-plugin-vitepress-python-editor */]

const pyodide = await loadPyodide({ checkAPIVersion: false })

if (packages.length > 0) {
  await pyodide.loadPackage('micropip')
  const micropip = pyodide.pyimport('micropip')
  for (const p of packages) {
    await micropip.install(p)
  }
}

const decoder = new TextDecoder()

let inputData = null
let waitFlag = null

onmessage = async (e) => {
  if (e.data.inputBuffer && e.data.waitBuffer && e.data.interruptBuffer) {
    inputData = new Uint8Array(e.data.inputBuffer)
    waitFlag = new Int32Array(e.data.waitBuffer)
    pyodide.setInterruptBuffer(e.data.interruptBuffer)
    return
  }
  const { id, code } = e.data
  pyodide.setStdout({ write: (buf) => {
    postMessage({ id, output: decoder.decode(buf) })
    return buf.length
  }})
  pyodide.setStdin({ stdin: () => {
    postMessage({ id, input: true })
    Atomics.wait(waitFlag, 0, 0)

    const inputArray = new Uint8Array(Atomics.load(inputData, 0))
    for (let i = 0; i < inputArray.length; i++)
      inputArray[i] = Atomics.load(inputData, i + 1)
    const inputText = decoder.decode(inputArray)

    postMessage({ id, output: `${inputText}\n` })
    return inputText
  }})
  try {
    // https://github.com/pyodide/pyodide/issues/703#issuecomment-1937774811
    const dict = pyodide.globals.get('dict')
    const globals = dict()
    await pyodide.runPythonAsync(code, { filename: '<editor>', globals, locals: globals })
    globals.destroy()
    dict.destroy()
  } catch(err) {
    if (err instanceof Error && err.constructor.name === 'PythonError') {
      let lines = err.message.split('\n')
      let output = lines
        .slice(lines.findIndex(line => line.includes('File "<editor>"')))
        .join('\n')
      if (!output.endsWith('KeyboardInterrupt\n')) postMessage({ id, output })
    } else {
      throw(err)
    }
  } finally {
    postMessage({ id, done: true })
  }
}

// indicate we are finished loading and ready to receive messages
postMessage({})
