function TextareaComponent({ label = 'Textarea', placeholder = '', required = false, rows = 3, isPreview = false, name, id, style: styleProp }) {
  const style = { marginBottom: '1rem', ...styleProp }
  const textareaId = id || name
  return (
    <div className="content-textarea" style={style}>
      {label && <label htmlFor={textareaId} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}{required && ' *'}</label>}
      <textarea
        id={textareaId}
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
