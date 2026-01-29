import { useState, useEffect } from 'react'

function SelectComponent({ label = 'Select', dataSource = '', required = false, options: staticOptions, isPreview = false, multiselect = false, name }) {
  const [options, setOptions] = useState(staticOptions || [])
  const [value, setValue] = useState(multiselect ? [] : '')

  useEffect(() => {
    if (dataSource && !staticOptions?.length) {
      const path = `/data/${dataSource}.json`
      fetch(path)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setOptions(Array.isArray(data) ? data : []))
        .catch(() => setOptions([]))
    } else if (staticOptions?.length) {
      setOptions(staticOptions)
    }
  }, [dataSource, staticOptions])

  const displayOptions = options.length ? options : [{ id: '', name: multiselect ? '— Select options —' : '— Select —' }]

  const handleChange = (e) => {
    if (multiselect) {
      const selected = Array.from(e.target.selectedOptions, (o) => o.value)
      setValue(selected)
    } else {
      setValue(e.target.value)
    }
  }

  return (
    <div className="content-select" style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}{required && ' *'}</label>}
      <select
        name={name}
        multiple={multiselect}
        required={required && !multiselect}
        disabled={!isPreview}
        value={multiselect ? value : (value || (displayOptions[0]?.id ?? ''))}
        onChange={handleChange}
        size={multiselect ? Math.min(6, displayOptions.length) : 1}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '0.9rem',
          backgroundColor: '#f8f9fa'
        }}
      >
        {displayOptions.map((opt) => (
          <option key={opt.id ?? opt.name} value={opt.id ?? opt.name}>
            {opt.name ?? opt.label ?? opt.id}
          </option>
        ))}
      </select>
      {multiselect && isPreview && value?.length > 0 && (
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
          Selected: {value.length} item(s)
        </div>
      )}
    </div>
  )
}

export default SelectComponent
