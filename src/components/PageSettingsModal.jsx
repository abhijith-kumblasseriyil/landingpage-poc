import { useState, useEffect } from 'react'
import './SettingsModal.css'

function PageSettingsModal({ page, pageIndex, onSave, onClose }) {
  const [name, setName] = useState('')
  const [customCss, setCustomCss] = useState('')

  useEffect(() => {
    if (page) {
      setName(page.name || '')
      setCustomCss(page.customCss || '')
    }
  }, [page])

  if (!page) return null

  const handleChange = (key, value) => {
    if (key === 'name') {
      setName(value)
      onSave(pageIndex, { name: value, customCss })
    } else if (key === 'customCss') {
      setCustomCss(value)
      onSave(pageIndex, { name, customCss: value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h3>Page Settings — {page.name}</h3>
          <button type="button" className="settings-modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="settings-modal-form">
          <div className="settings-field">
            <label>Page Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Page name"
            />
          </div>
          <div className="settings-field">
            <label>Custom CSS</label>
            <textarea
              value={customCss}
              onChange={(e) => handleChange('customCss', e.target.value)}
              placeholder="e.g. background-color: #f0f4f8; padding: 20px;"
              rows={6}
              className="settings-css-input"
            />
            <small className="settings-field-hint">CSS styles will be applied to the entire page container</small>
          </div>
          <div className="settings-modal-actions">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PageSettingsModal
