import { loadPyodide } from 'pyodide'

const pyodide = await loadPyodide()
const decoder = new TextDecoder()

let inputData = null
let waitFlag = null

onmessage = async (e) => {
  if (e.data.inputBuffer && e.data.waitBuffer) {
    inputData = new Uint8Array(e.data.inputBuffer)
    waitFlag = new Int32Array(e.data.waitBuffer)
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
    await pyodide.runPythonAsync(code, { filename: '<editor>' })
  } catch(err) {
    if (err instanceof Error && err.constructor.name === 'PythonError') {
      let lines = err.message.split('\n')
      let output = lines
        .slice(lines.findIndex(line => line.includes('File "<editor>"')))
        .join('\n')
      postMessage({ id, output })
    } else {
      throw(err)
    }
  } finally {
    postMessage({ id, done: true })
  }
}

// indicate we are finished loading and ready to receive messages
postMessage({})
