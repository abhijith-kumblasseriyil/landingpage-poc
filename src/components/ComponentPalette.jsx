import { useDraggable } from '@dnd-kit/core'
import { getComponent } from './componentRegistry'
import './ComponentPalette.css'

const LAYOUT_LABELS = {
  OneColumn: '1 column',
  TwoColumn: '2 column',
  ThreeColumn: '3 column',
  HR: 'Divider'
}

function DraggablePaletteItem({ type, allowed }) {
  const meta = getComponent(type)
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${type}`,
    data: { type: 'palette', componentType: type }
  })

  if (!meta || !allowed) return null

  const label = LAYOUT_LABELS[type] || type

  return (
    <div
      ref={setNodeRef}
      className={`palette-item ${isDragging ? 'palette-item-dragging' : ''} ${!allowed ? 'palette-item-disabled' : ''}`}
      {...listeners}
      {...attributes}
    >
      <span className="palette-item-icon">{meta.isLayout ? '⊞' : '◇'}</span>
      <span className="palette-item-label">{label}</span>
    </div>
  )
}

function ComponentPalette({ allowedComponents }) {
  const allowedSet = new Set(allowedComponents || [])

  const contentTypes = ['Text', 'Input', 'Select', 'Textarea', 'Checkbox', 'Radio', 'Button', 'UrlInput', 'Image', 'FileUpload', 'Payment', 'HR']
  const layoutTypes = ['OneColumn', 'TwoColumn', 'ThreeColumn']

  return (
    <div className="component-palette">
      <h3 className="palette-title">Components</h3>
      <div className="palette-section">
        <h4 className="palette-section-title">Layout</h4>
        {layoutTypes.map((type) => (
          <DraggablePaletteItem key={type} type={type} allowed={allowedSet.has(type)} />
        ))}
      </div>
      <div className="palette-section">
        <h4 className="palette-section-title">Content</h4>
        {contentTypes.map((type) => (
          <DraggablePaletteItem key={type} type={type} allowed={allowedSet.has(type)} />
        ))}
      </div>
    </div>
  )
}

export default ComponentPalette
