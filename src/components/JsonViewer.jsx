import { useState } from 'react'
import './JsonViewer.css'

function JsonViewer({ data, onLoad, onClose }) {
  const [jsonInput, setJsonInput] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const copyJson = () => {
    const json = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(json)
    alert('JSON copied to clipboard!')
  }

  const fullscreenIcon = (
    <svg className="json-viewer-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  )
  const closeFullscreenIcon = (
    <svg className="json-viewer-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )

  const headerActions = (fullscreen) => (
    <div className="json-viewer-actions">
      {onClose && (
        <button onClick={onClose} title="Close" className="json-viewer-btn-icon">
          ×
        </button>
      )}
      <button onClick={() => setShowInput(!showInput)}>
        {showInput ? 'Hide' : 'Show'} Input
      </button>
      <button onClick={copyJson}>Copy JSON</button>
      <button
        onClick={() => setIsFullscreen(!fullscreen)}
        title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        className="json-viewer-btn-icon"
      >
        {fullscreen ? closeFullscreenIcon : fullscreenIcon}
      </button>
    </div>
  )

  const innerContent = (
    <>
      <div className="json-viewer-header">
        <h3>JSON Output</h3>
        {headerActions(isFullscreen)}
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
      <pre className={`json-output ${isFullscreen ? 'json-output-fullscreen' : ''}`}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </>
  )

  if (isFullscreen) {
    return (
      <div
        className="json-viewer-fullscreen-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) setIsFullscreen(false) }}
      >
        <div
          className="json-viewer json-viewer-fullscreen"
          onClick={(e) => e.stopPropagation()}
        >
          {innerContent}
        </div>
      </div>
    )
  }

  return (
    <div className="json-viewer">
      {innerContent}
    </div>
  )
}

export default JsonViewer
