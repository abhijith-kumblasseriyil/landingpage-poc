import { usePreview } from '../../context/PreviewContext'

function ButtonComponent({
  label = 'Button',
  variant = 'primary',
  color: colorProp,
  isPreview = false,
  actionType = 'none',
  apiUrl = '',
  apiMethod = 'POST',
  apiIncludeFormData = false,
  customAction = '',
  validateBeforeAction = true,
  style: styleProp
}) {
  const preview = usePreview()

  const style = {
    padding: '0.5rem 1.25rem',
    border: '1px solid #3498db',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: isPreview ? 'pointer' : 'default',
    backgroundColor: variant === 'primary' ? '#3498db' : '#fff',
    color: (colorProp ?? styleProp?.color) || (variant === 'primary' ? '#fff' : '#3498db'),
    ...styleProp
  }

  const handleClick = async () => {
    if (!isPreview || !preview) return

    const shouldValidate = (actionType === 'next' || actionType === 'submit' || actionType === 'api') && validateBeforeAction
    if (shouldValidate && preview.reportValidity && !preview.reportValidity()) {
      return
    }

    switch (actionType) {
      case 'next':
        preview.goNext?.()
        break
      case 'previous':
        preview.goPrev?.()
        break
      case 'submit':
        // Validation already done above; could call optional onSubmit callback here
        if (preview.onSubmit) preview.onSubmit()
        break
      case 'api':
        if (apiUrl) {
          try {
            const method = apiMethod || 'POST'
            const opts = { method }
            const includeBody = apiIncludeFormData && method !== 'GET' && preview.getFormData
            if (includeBody) {
              const body = preview.getFormData()
              if (body && Object.keys(body).length > 0) {
                opts.headers = { 'Content-Type': 'application/json' }
                opts.body = JSON.stringify(body)
              }
            }
            const res = await fetch(apiUrl, opts)
            if (preview.onApiComplete) preview.onApiComplete(res)
          } catch (err) {
            if (preview.onApiError) preview.onApiError(err)
          }
        }
        break
      case 'custom':
        if (preview.onCustomAction) preview.onCustomAction(customAction)
        break
      default:
        break
    }
  }

  return (
    <button
      type="button"
      className="content-button"
      style={style}
      disabled={!isPreview}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}

export default ButtonComponent
