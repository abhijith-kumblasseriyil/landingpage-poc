function UrlInputComponent({ label = 'URL', placeholder = 'https://', isPreview = false, name, id, style: styleProp }) {
  const style = { marginBottom: '1rem', ...styleProp }
  const inputId = id || name
  return (
    <div className="content-url-input" style={style}>
      {label && <label htmlFor={inputId} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>}
      <input
        type="url"
        id={inputId}
        name={name}
        placeholder={placeholder}
        disabled={!isPreview}
        readOnly={!isPreview}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}
      />
    </div>
  )
}

export default UrlInputComponent
