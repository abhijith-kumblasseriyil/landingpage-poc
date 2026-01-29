import { useState, useEffect } from 'react'
import { getComponent } from './componentRegistry'
import './SettingsModal.css'

const DATA_SOURCES = ['locations', 'services']

function SettingsModal({ node, pageIndex, onSave, onClose }) {
  const [props, setProps] = useState({})
  const meta = node ? getComponent(node.type) : null

  useEffect(() => {
    if (node) setProps({ ...node.props })
  }, [node])

  if (!node || !meta || meta.isLayout || node.type === 'HR') return null

  const handleChange = (key, value) => {
    const next = { ...props, [key]: value }
    setProps(next)
    onSave(pageIndex, node.id, next)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onClose()
  }

  const renderField = () => {
    const type = node.type
    if (type === 'Text') {
      return (
        <>
          <div className="settings-field">
            <label>Content</label>
            <textarea value={props.content ?? ''} onChange={(e) => handleChange('content', e.target.value)} rows={2} />
          </div>
          <div className="settings-field">
            <label>Tag</label>
            <select value={props.tag ?? 'p'} onChange={(e) => handleChange('tag', e.target.value)}>
              <option value="p">Paragraph</option>
              <option value="heading">Heading</option>
              <option value="subheading">Subheading</option>
            </select>
          </div>
        </>
      )
    }
    if (type === 'Input') {
      return (
        <>
          <div className="settings-field">
            <label>Field name (API payload key)</label>
            <input type="text" value={props.fieldName ?? ''} onChange={(e) => handleChange('fieldName', e.target.value)} placeholder="e.g. emailAddress" />
          </div>
          <div className="settings-field">
            <label>Label</label>
            <input type="text" value={props.label ?? ''} onChange={(e) => handleChange('label', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Input type</label>
            <select value={props.type ?? 'text'} onChange={(e) => handleChange('type', e.target.value)}>
              <option value="text">Text</option>
              <option value="password">Password</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="tel">Tel</option>
              <option value="url">URL</option>
              <option value="search">Search</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="datetime-local">Date & time (local)</option>
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="color">Color</option>
              <option value="range">Range</option>
            </select>
          </div>
          <div className="settings-field">
            <label>Placeholder</label>
            <input type="text" value={props.placeholder ?? ''} onChange={(e) => handleChange('placeholder', e.target.value)} />
          </div>
          <div className="settings-field">
            <label><input type="checkbox" checked={!!props.required} onChange={(e) => handleChange('required', e.target.checked)} /> Required</label>
          </div>
        </>
      )
    }
    if (type === 'Select') {
      return (
        <>
          <div className="settings-field">
            <label>Field name (API payload key)</label>
            <input type="text" value={props.fieldName ?? ''} onChange={(e) => handleChange('fieldName', e.target.value)} placeholder="e.g. country" />
          </div>
          <div className="settings-field">
            <label>Label</label>
            <input type="text" value={props.label ?? ''} onChange={(e) => handleChange('label', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Selection mode</label>
            <select value={props.multiselect ? 'multiselect' : 'single'} onChange={(e) => handleChange('multiselect', e.target.value === 'multiselect')}>
              <option value="single">Single select</option>
              <option value="multiselect">Multiselect</option>
            </select>
          </div>
          <div className="settings-field">
            <label>Data source</label>
            <select value={props.dataSource ?? ''} onChange={(e) => handleChange('dataSource', e.target.value)}>
              <option value="">— None —</option>
              {DATA_SOURCES.map((ds) => (
                <option key={ds} value={ds}>{ds}</option>
              ))}
            </select>
          </div>
          <div className="settings-field">
            <label><input type="checkbox" checked={!!props.required} onChange={(e) => handleChange('required', e.target.checked)} /> Required</label>
          </div>
        </>
      )
    }
    if (type === 'Textarea') {
      return (
        <>
          <div className="settings-field">
            <label>Field name (API payload key)</label>
            <input type="text" value={props.fieldName ?? ''} onChange={(e) => handleChange('fieldName', e.target.value)} placeholder="e.g. message" />
          </div>
          <div className="settings-field">
            <label>Label</label>
            <input type="text" value={props.label ?? ''} onChange={(e) => handleChange('label', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Placeholder</label>
            <input type="text" value={props.placeholder ?? ''} onChange={(e) => handleChange('placeholder', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Rows</label>
            <input type="number" min={2} value={props.rows ?? 3} onChange={(e) => handleChange('rows', parseInt(e.target.value, 10) || 3)} />
          </div>
          <div className="settings-field">
            <label><input type="checkbox" checked={!!props.required} onChange={(e) => handleChange('required', e.target.checked)} /> Required</label>
          </div>
        </>
      )
    }
    if (type === 'Button') {
      return (
        <>
          <div className="settings-field">
            <label>Label</label>
            <input type="text" value={props.label ?? ''} onChange={(e) => handleChange('label', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Variant</label>
            <select value={props.variant ?? 'primary'} onChange={(e) => handleChange('variant', e.target.value)}>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </div>
          <div className="settings-field">
            <label>Action</label>
            <select value={props.actionType ?? 'none'} onChange={(e) => handleChange('actionType', e.target.value)}>
              <option value="none">None</option>
              <option value="next">Next page / screen</option>
              <option value="previous">Previous page / screen</option>
              <option value="submit">Submit form</option>
              <option value="api">Call API</option>
              <option value="custom">Custom action</option>
            </select>
          </div>
          {(props.actionType === 'next' || props.actionType === 'submit') && (
            <div className="settings-field">
              <label><input type="checkbox" checked={!!props.validateBeforeAction} onChange={(e) => handleChange('validateBeforeAction', e.target.checked)} /> Validate form before action</label>
            </div>
          )}
          {props.actionType === 'api' && (
            <>
              <div className="settings-field">
                <label>API URL</label>
                <input type="url" value={props.apiUrl ?? ''} onChange={(e) => handleChange('apiUrl', e.target.value)} placeholder="https://api.example.com/endpoint" />
              </div>
              <div className="settings-field">
                <label>Method</label>
                <select value={props.apiMethod ?? 'POST'} onChange={(e) => handleChange('apiMethod', e.target.value)}>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div className="settings-field">
                <label><input type="checkbox" checked={!!props.validateBeforeAction} onChange={(e) => handleChange('validateBeforeAction', e.target.checked)} /> Validate form before API call</label>
              </div>
              <div className="settings-field">
                <label><input type="checkbox" checked={!!props.apiIncludeFormData} onChange={(e) => handleChange('apiIncludeFormData', e.target.checked)} /> Include current page/screen form data in request body</label>
              </div>
            </>
          )}
          {props.actionType === 'custom' && (
            <div className="settings-field">
              <label>Custom action name</label>
              <input type="text" value={props.customAction ?? ''} onChange={(e) => handleChange('customAction', e.target.value)} placeholder="e.g. onSave" />
            </div>
          )}
        </>
      )
    }
    if (type === 'Image') {
      return (
        <>
          <div className="settings-field">
            <label>Image URL</label>
            <input type="url" value={props.src ?? ''} onChange={(e) => handleChange('src', e.target.value)} placeholder="https://" />
          </div>
          <div className="settings-field">
            <label>Alt text</label>
            <input type="text" value={props.alt ?? ''} onChange={(e) => handleChange('alt', e.target.value)} />
          </div>
        </>
      )
    }
    if (type === 'Checkbox') {
      return (
        <>
          <div className="settings-field">
            <label>Field name (API payload key)</label>
            <input type="text" value={props.fieldName ?? ''} onChange={(e) => handleChange('fieldName', e.target.value)} placeholder="e.g. acceptTerms" />
          </div>
          <div className="settings-field">
            <label>Label</label>
            <input type="text" value={props.label ?? ''} onChange={(e) => handleChange('label', e.target.value)} />
          </div>
          <div className="settings-field">
            <label><input type="checkbox" checked={!!props.checked} onChange={(e) => handleChange('checked', e.target.checked)} /> Checked by default</label>
          </div>
        </>
      )
    }
    if (type === 'Radio') {
      return (
        <>
          <div className="settings-field">
            <label>Field name (API payload key)</label>
            <input type="text" value={props.fieldName ?? ''} onChange={(e) => handleChange('fieldName', e.target.value)} placeholder="e.g. preferredContact" />
          </div>
          <div className="settings-field">
            <label>Label</label>
            <input type="text" value={props.label ?? ''} onChange={(e) => handleChange('label', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Options (one per line)</label>
            <textarea
              value={Array.isArray(props.options) ? props.options.join('\n') : (props.options || '')}
              onChange={(e) => handleChange('options', e.target.value.split('\n').filter(Boolean))}
              rows={3}
            />
          </div>
        </>
      )
    }
    if (type === 'TwoColumn') {
      return (
        <div className="settings-field">
          <label>Column ratio</label>
          <select value={props.ratio ?? '50-50'} onChange={(e) => handleChange('ratio', e.target.value)}>
            <option value="50-50">50 / 50</option>
            <option value="33-67">33 / 67</option>
            <option value="67-33">67 / 33</option>
            <option value="25-75">25 / 75</option>
            <option value="75-25">75 / 25</option>
          </select>
        </div>
      )
    }
    if (type === 'Payment') {
      return (
        <>
          <div className="settings-field">
            <label>Field name prefix (API payload keys: prefix_cardNumber, prefix_expiry, etc.)</label>
            <input type="text" value={props.fieldName ?? ''} onChange={(e) => handleChange('fieldName', e.target.value)} placeholder="e.g. payment" />
          </div>
          <div className="settings-field">
            <label>Section label</label>
            <input type="text" value={props.label ?? 'Payment details'} onChange={(e) => handleChange('label', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Card number placeholder</label>
            <input type="text" value={props.cardNumberPlaceholder ?? ''} onChange={(e) => handleChange('cardNumberPlaceholder', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Expiry placeholder</label>
            <input type="text" value={props.expiryPlaceholder ?? ''} onChange={(e) => handleChange('expiryPlaceholder', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>CVV placeholder</label>
            <input type="text" value={props.cvvPlaceholder ?? ''} onChange={(e) => handleChange('cvvPlaceholder', e.target.value)} />
          </div>
          <div className="settings-field">
            <label>Cardholder name placeholder</label>
            <input type="text" value={props.cardholderPlaceholder ?? ''} onChange={(e) => handleChange('cardholderPlaceholder', e.target.value)} />
          </div>
          <div className="settings-field">
            <label><input type="checkbox" checked={!!props.required} onChange={(e) => handleChange('required', e.target.checked)} /> Required</label>
          </div>
        </>
      )
    }
    if (type === 'FileUpload' || type === 'UrlInput') {
      return (
        <>
          <div className="settings-field">
            <label>Field name (API payload key)</label>
            <input type="text" value={props.fieldName ?? ''} onChange={(e) => handleChange('fieldName', e.target.value)} placeholder={type === 'UrlInput' ? 'e.g. websiteUrl' : 'e.g. attachment'} />
          </div>
          <div className="settings-field">
            <label>Label</label>
            <input type="text" value={props.label ?? ''} onChange={(e) => handleChange('label', e.target.value)} />
          </div>
        </>
      )
    }
    return <p className="settings-no-fields">No settings for this component.</p>
  }

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h3>Settings — {node.type}</h3>
          <button type="button" className="settings-modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="settings-modal-form">
          {renderField()}
          <div className="settings-field settings-field-color">
            <label>Color</label>
            <div className="settings-color-row">
              <input
                type="color"
                value={props.color || '#000000'}
                onChange={(e) => handleChange('color', e.target.value)}
                className="settings-color-picker"
                title="Pick color"
              />
              <input
                type="text"
                value={props.color ?? ''}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="#000000"
                className="settings-color-hex"
              />
            </div>
          </div>
          <div className="settings-modal-actions">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SettingsModal
