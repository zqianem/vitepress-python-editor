import { loadPyodide } from 'pyodide'

const pyodide = await loadPyodide()

onmessage = async (e) => {
  const { id, code } = e.data
  pyodide.setStdout({ batched: (output) => {
    postMessage({ id, output })
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