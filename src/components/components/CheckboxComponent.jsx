function CheckboxComponent({ label = 'Checkbox', checked = false, isPreview = false }) {
  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <input
        type="checkbox"
        defaultChecked={checked}
        disabled={!isPreview}
        style={{ width: '18px', height: '18px', cursor: isPreview ? 'pointer' : 'not-allowed' }}
      />
      <label style={{ fontWeight: 500, cursor: isPreview ? 'pointer' : 'not-allowed' }}>
        {label}
      </label>
    </div>
  )
}

export default CheckboxComponent
