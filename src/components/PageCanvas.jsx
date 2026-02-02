import { useCallback, useMemo, useEffect } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useBuilder } from '../context/BuilderContext'
import { usePreview } from '../context/PreviewContext'
import CanvasNode from './CanvasNode'
import './PageCanvas.css'

function PageCssInjector({ pageId, customCss }) {
  useEffect(() => {
    const styleId = `page-css-${pageId}`
    let styleEl = document.getElementById(styleId)
    
    if (customCss) {
      // Update or create style element with CSS
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = styleId
        document.head.appendChild(styleEl)
      }
      // Scope CSS to this page container and its form element
      styleEl.textContent = `[data-page-id="${pageId}"] { ${customCss} }\n[data-page-id="${pageId}"] .preview-form { ${customCss} }`
    } else if (customCss === '') {
      // Only remove if CSS is explicitly cleared (empty string)
      if (styleEl) {
        styleEl.remove()
      }
    }
    // If customCss is undefined/null, do nothing - let CSS persist when component unmounts
    
    // No cleanup on unmount - CSS persists when switching between preview/edit modes
    // The style element will be reused or updated by other PageCanvas instances
  }, [pageId, customCss])
  
  return null
}

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

  const pageCustomCss = page?.customCss

  if (isPreview) {
    const formRef = previewContext?.setFormRef

    return (
      <div className="page-canvas page-canvas-preview" data-page-id={page.id}>
        <PageCssInjector pageId={page.id} customCss={pageCustomCss} />
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
    <div className="page-canvas" data-page-id={page.id}>
      <PageCssInjector pageId={page.id} customCss={pageCustomCss} />
      <RootDroppable />
    </div>
  )
}

export default PageCanvas
