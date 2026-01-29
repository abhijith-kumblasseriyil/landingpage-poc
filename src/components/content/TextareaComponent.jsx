function TextareaComponent({ label = 'Textarea', placeholder = '', required = false, rows = 3, isPreview = false, name }) {
  return (
    <div className="content-textarea" style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}{required && ' *'}</label>}
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={!isPreview}
        readOnly={!isPreview}
        rows={rows}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '0.9rem',
          resize: 'vertical'
        }}
      />
    </div>
  )
}

export default TextareaComponent
