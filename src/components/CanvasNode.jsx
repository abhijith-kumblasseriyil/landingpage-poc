import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getComponent, getDefaultProps } from './componentRegistry'
import './CanvasNode.css'

function CustomCssInjector({ nodeId, customCss }) {
  useEffect(() => {
    if (!customCss) return
    const styleId = `custom-css-${nodeId}`
    let styleEl = document.getElementById(styleId)
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    // Scope CSS to this component using data attribute selector
    styleEl.textContent = `[data-component-id="${nodeId}"] { ${customCss} }`
    return () => {
      const el = document.getElementById(styleId)
      if (el) el.remove()
    }
  }, [nodeId, customCss])
  return null
}

const LAYOUT_DISPLAY_NAMES = {
  OneColumn: '1 column',
  TwoColumn: '2 column',
  ThreeColumn: '3 column'
}

function getComponentDisplayName(type) {
  return LAYOUT_DISPLAY_NAMES[type] ?? type
}

function CanvasNode({ node, pageIndex, slotKey, isPreview, onSettings, onDelete, renderSlot }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const meta = getComponent(node.type)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: node.id,
    data: {
      type: 'canvas',
      nodeId: node.id,
      pageIndex,
      slotKey
    }
  })

  if (!meta) return null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const props = { ...getDefaultProps(node.type), ...node.props }
  if (!meta.isLayout && props.color) {
    props.style = { ...(props.style || {}), color: props.color }
  }
  const isLayout = meta.isLayout
  const customCss = props.customCss

  const componentContent = isLayout ? (
    <meta.Component
      id={node.id}
      children={node.slots}
      isPreview={isPreview}
      renderSlot={(n, colIndex) => renderSlot(n, pageIndex, `${node.id}:${colIndex}`)}
      {...props}
    />
  ) : (
    <meta.Component
      {...props}
      isPreview={isPreview}
      name={isPreview ? (props.fieldName || node.id) : undefined}
      id={isPreview ? node.id : undefined}
    />
  )

  const content = customCss ? (
    <>
      <CustomCssInjector nodeId={node.id} customCss={customCss} />
      <div data-component-id={node.id}>
        {componentContent}
      </div>
    </>
  ) : (
    componentContent
  )

  if (isPreview) {
    return (
      <div className="canvas-node canvas-node-preview">
        {content}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`canvas-node ${isDragging ? 'canvas-node-dragging' : ''}`}
      data-node-id={node.id}
    >
      <div className="canvas-node-header">
        <span className="canvas-node-drag" {...listeners} {...attributes}>⋮⋮</span>
        <span className="canvas-node-type">{getComponentDisplayName(node.type)}</span>
        <div className="canvas-node-actions">
          {!isLayout && node.type !== 'HR' && (
            <button type="button" className="canvas-node-btn canvas-node-settings" onClick={(e) => { e.stopPropagation(); e.preventDefault(); onSettings(node); }} title="Settings">⚙</button>
          )}
          <button type="button" className="canvas-node-btn canvas-node-delete" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowDeleteConfirm(true); }} title="Delete">✕</button>
        </div>
      </div>
      <div className="canvas-node-body">
        {content}
      </div>
      {showDeleteConfirm && createPortal(
        <div className="canvas-node-delete-overlay canvas-node-delete-overlay-portal" onClick={() => setShowDeleteConfirm(false)}>
          <div className="canvas-node-delete-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="canvas-node-delete-message">Delete this <strong>{getComponentDisplayName(node.type)}</strong> component?</p>
            <div className="canvas-node-delete-actions">
              <button type="button" className="canvas-node-delete-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button type="button" className="canvas-node-delete-confirm" onClick={() => { onDelete(node.id); setShowDeleteConfirm(false); }}>Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default CanvasNode
