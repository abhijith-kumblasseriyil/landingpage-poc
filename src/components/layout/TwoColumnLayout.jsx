import { useDroppable } from '@dnd-kit/core'

function TwoColumnLayout({ id, children, isPreview, renderSlot, ratio = '50-50' }) {
  const [r1, r2] = ratio.split('-').map((r) => r.trim() ? parseInt(r, 10) : 50)
  const left = r1 / (r1 + r2) * 100
  const right = 100 - left

  const { isOver: isOver0, setNodeRef: setRef0 } = useDroppable({ id: `slot:${id}:0` })
  const { isOver: isOver1, setNodeRef: setRef1 } = useDroppable({ id: `slot:${id}:1` })

  const renderCol0 = (node) => (typeof renderSlot === 'function' ? renderSlot(node, 0) : null)
  const renderCol1 = (node) => (typeof renderSlot === 'function' ? renderSlot(node, 1) : null)

  if (isPreview) {
    return (
      <div className="layout-two-column layout-preview" style={{ display: 'flex', gap: '1rem' }}>
        <div className="layout-slot-preview" style={{ flex: left }}>
          {children?.[0]?.length ? children[0].map(renderCol0) : null}
        </div>
        <div className="layout-slot-preview" style={{ flex: right }}>
          {children?.[1]?.length ? children[1].map(renderCol1) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="layout-two-column layout-builder" data-layout-id={id} style={{ display: 'flex', gap: '0.5rem' }}>
      <div
        ref={setRef0}
        className={`layout-slot ${isOver0 ? 'layout-slot-over' : ''}`}
        style={{ flex: left }}
        data-slot="0"
      >
        {children?.[0]?.length ? children[0].map(renderCol0) : <span className="layout-slot-placeholder">Left</span>}
      </div>
      <div
        ref={setRef1}
        className={`layout-slot ${isOver1 ? 'layout-slot-over' : ''}`}
        style={{ flex: right }}
        data-slot="1"
      >
        {children?.[1]?.length ? children[1].map(renderCol1) : <span className="layout-slot-placeholder">Right</span>}
      </div>
    </div>
  )
}

export default TwoColumnLayout
