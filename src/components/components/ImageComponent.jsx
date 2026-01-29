function ImageComponent({ src = '', alt = 'Image' }) {
  if (!src) {
    return (
      <div style={{
        padding: '2rem',
        border: '2px dashed #ddd',
        textAlign: 'center',
        color: '#95a5a6'
      }}>
        No image source
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
    />
  )
}

export default ImageComponent
