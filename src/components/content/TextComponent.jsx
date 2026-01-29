function TextComponent({ content = 'Text', tag = 'p', style }) {
  const Tag = tag === 'heading' ? 'h2' : tag === 'subheading' ? 'h3' : 'p'
  return <Tag className="content-text" style={style}>{content}</Tag>
}

export default TextComponent
