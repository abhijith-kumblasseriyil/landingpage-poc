function RadioComponent({ label = 'Radio', options = ['Option 1', 'Option 2'], isPreview = false }) {
  const opts = Array.isArray(options) ? options : [options]
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {opts.map((option, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name={`radio-${label}`}
              disabled={!isPreview}
              value={typeof option === 'string' ? option : option?.id ?? option?.name}
              style={{ width: '18px', height: '18px', cursor: isPreview ? 'pointer' : 'not-allowed' }}
            />
            <label style={{ cursor: isPreview ? 'pointer' : 'not-allowed' }}>{typeof option === 'string' ? option : option?.name ?? option?.id}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RadioComponent
