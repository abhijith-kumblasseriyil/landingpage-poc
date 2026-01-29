import { useCallback, useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useBuilder } from '../context/BuilderContext'
import { usePreview } from '../context/PreviewContext'
import CanvasNode from './CanvasNode'
import './PageCanvas.css'

function collectIds(list) {
  const ids = []
  for (const c of list) {
    ids.push(c.id)
    if (c.slots) for (const col of c.slots) ids.push(...collectIds(col))
  }
  return ids
}

function PageCanvas({ isPreview, onSettings, previewPageIndex }) {
  const {
    pages,
    currentPageIndex,
    removeComponent,
    formName,
    formId
  } = useBuilder()
  const previewContext = usePreview()

  const pageIndex = isPreview && previewPageIndex !== undefined ? previewPageIndex : currentPageIndex
  const page = pages[pageIndex]
  const components = page?.components || []
  const allIds = useMemo(() => collectIds(components), [components])

  const renderSlot = useCallback((node, pageIndex, slotKey) => (
    <CanvasNode
      key={node.id}
      node={node}
      pageIndex={pageIndex}
      slotKey={slotKey}
      isPreview={isPreview}
      onSettings={onSettings}
      onDelete={(nodeId) => removeComponent(pageIndex, nodeId)}
      renderSlot={renderSlot}
    />
  ), [isPreview, onSettings, removeComponent])

  if (!page) return null

  const rootDroppableId = `root:${pageIndex}`

  const RootDroppable = () => {
    const { isOver, setNodeRef } = useDroppable({ id: rootDroppableId })
    return (
      <div
        ref={setNodeRef}
        className={`canvas-root-slot ${isOver ? 'canvas-root-slot-over' : ''}`}
      >
        <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
          {components.length
            ? components.map((node) => (
                <CanvasNode
                  key={node.id}
                  node={node}
                  pageIndex={pageIndex}
                  slotKey="root"
                  isPreview={isPreview}
                  onSettings={onSettings}
                  onDelete={(nodeId) => removeComponent(pageIndex, nodeId)}
                  renderSlot={renderSlot}
                />
              ))
            : !isPreview && <span className="canvas-empty-hint">Drag components here</span>}
        </SortableContext>
      </div>
    )
  }

  if (isPreview) {
    const formRef = previewContext?.setFormRef

    return (
      <div className="page-canvas page-canvas-preview">
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="preview-form canvas-root-slot"
          noValidate
          name={formName || undefined}
          id={formId || undefined}
        >
          {components.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              pageIndex={pageIndex}
              slotKey="root"
              isPreview
              onSettings={() => {}}
              onDelete={() => {}}
              renderSlot={renderSlot}
            />
          ))}
        </form>
      </div>
    )
  }

  return (
    <div className="page-canvas">
      <RootDroppable />
    </div>
  )
}

export default PageCanvas
