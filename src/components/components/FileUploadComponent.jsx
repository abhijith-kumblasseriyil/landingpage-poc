function FileUploadComponent({ label = 'Upload File', accept = '*', isPreview = false, name, id, style: styleProp }) {
  const style = { marginBottom: '1rem', ...styleProp }
  const inputId = id || name
  return (
    <div style={style}>
      <label htmlFor={inputId} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        {label}
      </label>
      <input
        type="file"
        id={inputId}
        name={name}
        accept={accept}
        disabled={!isPreview}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '0.9rem',
          backgroundColor: '#f8f9fa',
          cursor: isPreview ? 'pointer' : 'not-allowed'
        }}
      />
    </div>
  )
}

export default FileUploadComponent
