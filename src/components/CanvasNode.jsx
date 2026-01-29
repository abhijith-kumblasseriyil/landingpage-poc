import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getComponent, getDefaultProps } from './componentRegistry'
import './CanvasNode.css'

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

  const content = isLayout ? (
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
        <span className="canvas-node-type">{node.type}</span>
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
      {showDeleteConfirm && (
        <div className="canvas-node-delete-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="canvas-node-delete-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="canvas-node-delete-message">Delete this component?</p>
            <div className="canvas-node-delete-actions">
              <button type="button" className="canvas-node-delete-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button type="button" className="canvas-node-delete-confirm" onClick={() => { onDelete(node.id); setShowDeleteConfirm(false); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CanvasNode
