function UrlInputComponent({ label = 'URL', placeholder = 'https://', isPreview = false }) {
  return (
    <div className="content-url-input" style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>}
      <input
        type="url"
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
