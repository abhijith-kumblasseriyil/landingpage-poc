function InputComponent({ label = 'Input', placeholder = '', required = false, type = 'text', isPreview = false, name }) {
  return (
    <div className="content-input" style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}{required && ' *'}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
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

export default InputComponent
