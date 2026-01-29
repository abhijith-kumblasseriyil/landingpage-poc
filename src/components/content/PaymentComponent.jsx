function PaymentComponent({
  label = 'Payment details',
  cardNumberPlaceholder = 'Card number',
  expiryPlaceholder = 'MM/YY',
  cvvPlaceholder = 'CVV',
  cardholderPlaceholder = 'Cardholder name',
  required = false,
  isPreview = false,
  name: namePrefix,
  id: idPrefix,
  style: styleProp
}) {
  const baseId = idPrefix || namePrefix
  const wrapperStyle = { marginBottom: '1rem', ...styleProp }
  const fieldStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem'
  }
  const labelStyle = { display: 'block', marginBottom: '0.35rem', fontWeight: 500 }
  const rowStyle = { marginBottom: '0.75rem' }
  const fieldId = (suffix) => (baseId ? `${baseId}_${suffix}` : undefined)
  const fieldName = (suffix) => (namePrefix ? `${namePrefix}_${suffix}` : undefined)

  return (
    <div className="content-payment" style={wrapperStyle}>
      {label && (
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 600 }}>{label}</h4>
      )}
      <div style={rowStyle}>
        <label htmlFor={fieldId('cardNumber')} style={labelStyle}>Card number {required && ' *'}</label>
        <input
          type="text"
          id={fieldId('cardNumber')}
          name={fieldName('cardNumber')}
          placeholder={cardNumberPlaceholder}
          required={required}
          disabled={!isPreview}
          readOnly={!isPreview}
          inputMode="numeric"
          autoComplete="cc-number"
          maxLength={19}
          style={fieldStyle}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ ...rowStyle, flex: '1 1 120px' }}>
          <label htmlFor={fieldId('expiry')} style={labelStyle}>Expiry (MM/YY) {required && ' *'}</label>
          <input
            type="text"
            id={fieldId('expiry')}
            name={fieldName('expiry')}
            placeholder={expiryPlaceholder}
            required={required}
            disabled={!isPreview}
            readOnly={!isPreview}
            autoComplete="cc-exp"
            maxLength={5}
            style={fieldStyle}
          />
        </div>
        <div style={{ ...rowStyle, flex: '0 1 100px' }}>
          <label htmlFor={fieldId('cvv')} style={labelStyle}>CVV {required && ' *'}</label>
          <input
            type="password"
            id={fieldId('cvv')}
            name={fieldName('cvv')}
            placeholder={cvvPlaceholder}
            required={required}
            disabled={!isPreview}
            readOnly={!isPreview}
            autoComplete="cc-csc"
            maxLength={4}
            style={fieldStyle}
          />
        </div>
      </div>
      <div style={rowStyle}>
        <label htmlFor={fieldId('cardholderName')} style={labelStyle}>Cardholder name {required && ' *'}</label>
        <input
          type="text"
          id={fieldId('cardholderName')}
          name={fieldName('cardholderName')}
          placeholder={cardholderPlaceholder}
          required={required}
          disabled={!isPreview}
          readOnly={!isPreview}
          autoComplete="cc-name"
          style={fieldStyle}
        />
      </div>
    </div>
  )
}

export default PaymentComponent
