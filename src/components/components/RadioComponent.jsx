function RadioComponent({ label = 'Radio', options = ['Option 1', 'Option 2'], isPreview = false, name, id, style: styleProp }) {
  const opts = Array.isArray(options) ? options : [options]
  const style = { marginBottom: '1rem', ...styleProp }
  const groupName = name || `radio-${label}`
  const baseId = id || groupName
  return (
    <div style={style}>
      <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {opts.map((option, index) => {
          const optionValue = typeof option === 'string' ? option : option?.id ?? option?.name
          const optionId = `${baseId}_${index}`
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                id={optionId}
                name={groupName}
                disabled={!isPreview}
                value={optionValue}
                style={{ width: '18px', height: '18px', cursor: isPreview ? 'pointer' : 'not-allowed' }}
              />
              <label htmlFor={optionId} style={{ cursor: isPreview ? 'pointer' : 'not-allowed' }}>{typeof option === 'string' ? option : option?.name ?? option?.id}</label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RadioComponent
