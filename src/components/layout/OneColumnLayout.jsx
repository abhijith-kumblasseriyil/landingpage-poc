import { useDroppable } from '@dnd-kit/core'

function OneColumnLayout({ id, children, isPreview, renderSlot }) {
  const { isOver, setNodeRef } = useDroppable({ id: `slot:${id}:0` })

  const renderCol = (node) => (typeof renderSlot === 'function' ? renderSlot(node, 0) : null)

  if (isPreview) {
    return (
      <div className="layout-one-column layout-preview">
        <div className="layout-slot-preview">
          {children?.[0]?.length ? children[0].map(renderCol) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="layout-one-column layout-builder" data-layout-id={id}>
      <div
        ref={setNodeRef}
        className={`layout-slot ${isOver ? 'layout-slot-over' : ''}`}
        data-slot="0"
      >
        {children?.[0]?.length ? children[0].map(renderCol) : <span className="layout-slot-placeholder">Drop here</span>}
      </div>
    </div>
  )
}

export default OneColumnLayout
