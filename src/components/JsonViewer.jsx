import { useState } from 'react'
import './JsonViewer.css'

function JsonViewer({ data, onLoad }) {
  const [jsonInput, setJsonInput] = useState('')
  const [showInput, setShowInput] = useState(false)

  const handleLoadJson = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      onLoad(parsed)
      setJsonInput('')
      setShowInput(false)
      alert('JSON loaded successfully!')
    } catch (error) {
      alert('Invalid JSON: ' + error.message)
    }
  }

  return (
    <div className="json-viewer">
      <div className="json-viewer-header">
        <h3>JSON Output</h3>
        <div className="json-viewer-actions">
          <button onClick={() => setShowInput(!showInput)}>
            {showInput ? 'Hide' : 'Show'} Input
          </button>
          <button onClick={() => {
            const json = JSON.stringify(data, null, 2)
            navigator.clipboard.writeText(json)
            alert('JSON copied to clipboard!')
          }}>
            Copy JSON
          </button>
        </div>
      </div>

      {showInput && (
        <div className="json-input-section">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON here..."
            rows={6}
          />
          <button onClick={handleLoadJson}>Load JSON</button>
        </div>
      )}

      <pre className="json-output">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

export default JsonViewer
