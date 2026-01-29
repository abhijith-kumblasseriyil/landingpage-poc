function CheckboxComponent({ label = 'Checkbox', checked = false, isPreview = false, name, id, style: styleProp }) {
  const style = { marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', ...styleProp }
  const inputId = id || name
  return (
    <div style={style}>
      <input
        type="checkbox"
        id={inputId}
        name={name}
        defaultChecked={checked}
        disabled={!isPreview}
        style={{ width: '18px', height: '18px', cursor: isPreview ? 'pointer' : 'not-allowed' }}
      />
      <label htmlFor={inputId} style={{ fontWeight: 500, cursor: isPreview ? 'pointer' : 'not-allowed' }}>
        {label}
      </label>
    </div>
  )
}

export default CheckboxComponent
