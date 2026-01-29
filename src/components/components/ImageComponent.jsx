function ImageComponent({ src = '', alt = 'Image', style: styleProp }) {
  if (!src) {
    const style = {
      padding: '2rem',
      border: '2px dashed #ddd',
      textAlign: 'center',
      color: '#95a5a6',
      ...styleProp
    }
    return (
      <div style={style}>
        No image source
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ maxWidth: '100%', height: 'auto', display: 'block', ...styleProp }}
    />
  )
}

export default ImageComponent
