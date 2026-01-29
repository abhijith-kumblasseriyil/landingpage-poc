import { useDroppable } from '@dnd-kit/core'

function ThreeColumnLayout({ id, children, isPreview, renderSlot }) {
  const { isOver: isOver0, setNodeRef: setRef0 } = useDroppable({ id: `slot:${id}:0` })
  const { isOver: isOver1, setNodeRef: setRef1 } = useDroppable({ id: `slot:${id}:1` })
  const { isOver: isOver2, setNodeRef: setRef2 } = useDroppable({ id: `slot:${id}:2` })

  const renderCol = (colIndex) => (node) => (typeof renderSlot === 'function' ? renderSlot(node, colIndex) : null)

  if (isPreview) {
    return (
      <div className="layout-three-column layout-preview" style={{ display: 'flex', gap: '1rem' }}>
        <div className="layout-slot-preview" style={{ flex: 1 }}>{children?.[0]?.length ? children[0].map(renderCol(0)) : null}</div>
        <div className="layout-slot-preview" style={{ flex: 1 }}>{children?.[1]?.length ? children[1].map(renderCol(1)) : null}</div>
        <div className="layout-slot-preview" style={{ flex: 1 }}>{children?.[2]?.length ? children[2].map(renderCol(2)) : null}</div>
      </div>
    )
  }

  return (
    <div className="layout-three-column layout-builder" data-layout-id={id} style={{ display: 'flex', gap: '0.5rem' }}>
      <div ref={setRef0} className={`layout-slot ${isOver0 ? 'layout-slot-over' : ''}`} style={{ flex: 1 }} data-slot="0">
        {children?.[0]?.length ? children[0].map(renderCol(0)) : <span className="layout-slot-placeholder">Col 1</span>}
      </div>
      <div ref={setRef1} className={`layout-slot ${isOver1 ? 'layout-slot-over' : ''}`} style={{ flex: 1 }} data-slot="1">
        {children?.[1]?.length ? children[1].map(renderCol(1)) : <span className="layout-slot-placeholder">Col 2</span>}
      </div>
      <div ref={setRef2} className={`layout-slot ${isOver2 ? 'layout-slot-over' : ''}`} style={{ flex: 1 }} data-slot="2">
        {children?.[2]?.length ? children[2].map(renderCol(2)) : <span className="layout-slot-placeholder">Col 3</span>}
      </div>
    </div>
  )
}

export default ThreeColumnLayout
