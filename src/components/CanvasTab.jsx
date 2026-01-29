import { useState, useCallback, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core'
import { useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { useBuilder } from '../context/BuilderContext'
import ComponentPalette from './ComponentPalette'
import PageCanvas from './PageCanvas'
import PreviewNavigation from './PreviewNavigation'
import JsonViewer from './JsonViewer'
import SettingsModal from './SettingsModal'
import { getComponent, getDefaultProps } from './componentRegistry'
import './CanvasTab.css'

function CanvasTab() {
  const {
    pages,
    currentPageIndex,
    setCurrentPage,
    addPage,
    removePage,
    updateComponent,
    getOutputSchema,
    loadSchema,
    allowedComponents,
    addComponent,
    reorderComponents,
    moveComponent,
    findNodeLocation,
    getNodeById,
    generateId,
    templateType
  } = useBuilder()

  const [isPreview, setIsPreview] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [settingsNode, setSettingsNode] = useState(null)
  const [settingsPageIndex, setSettingsPageIndex] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  const handleSettings = useCallback((node) => {
    setSettingsNode(node)
    setSettingsPageIndex(currentPageIndex)
  }, [currentPageIndex])
  const handleSettingsSave = useCallback((pageIndex, nodeId, props) => {
    updateComponent(pageIndex, nodeId, props)
    setSettingsNode(null)
    setSettingsPageIndex(null)
  }, [updateComponent])
  const handleSettingsClose = useCallback(() => {
    setSettingsNode(null)
    setSettingsPageIndex(null)
  }, [])

  function findLayoutInTree(list, layoutId) {
    for (const c of list) {
      if (c.id === layoutId) return c
      if (c.slots) for (const col of c.slots) { const n = findLayoutInTree(col, layoutId); if (n) return n }
    }
    return null
  }
  function getColumnNodes(list, slotKey) {
    if (!slotKey || slotKey === 'root') return list
    const [layoutId, colIndex] = slotKey.split(':')
    const col = parseInt(colIndex, 10)
    const layout = findLayoutInTree(list, layoutId)
    return layout?.slots?.[col] || []
  }

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over) return

    const overId = over.id
    const activeData = active.data?.current

    const page = pages[currentPageIndex]
    const components = page?.components || []

    let targetPageIndex = currentPageIndex
    let targetSlotKey = 'root'
    let targetIndex = undefined

    if (typeof overId === 'string') {
      if (overId.startsWith('root:')) {
        targetPageIndex = parseInt(overId.split(':')[1], 10)
        targetSlotKey = 'root'
        const targetPage = pages[targetPageIndex]
        targetIndex = targetPage?.components?.length ?? 0
      } else if (overId.startsWith('slot:')) {
        const [, layoutId, colIndex] = overId.split(':')
        targetSlotKey = `${layoutId}:${colIndex}`
        const targetPage = pages[currentPageIndex]
        const col = getColumnNodes(targetPage?.components, targetSlotKey)
        targetIndex = col?.length ?? 0
      } else {
        const loc = findNodeLocation(overId)
        if (loc) {
          targetPageIndex = loc.pageIndex
          targetSlotKey = loc.slotKey
          targetIndex = loc.indexInSlot
        }
      }
    }

    if (activeData?.type === 'palette') {
      const type = activeData.componentType
      const meta = getComponent(type)
      if (!meta || !allowedComponents?.includes(type)) return
      const node = {
        id: generateId(),
        type,
        props: { ...getDefaultProps(type) },
        slots: meta.isLayout ? [[]] : undefined
      }
      if (meta.isLayout) {
        const numCols = type === 'OneColumn' ? 1 : type === 'TwoColumn' ? 2 : 3
        node.slots = Array.from({ length: numCols }, () => [])
      }
      addComponent(targetPageIndex, targetSlotKey, targetIndex, node)
      if (!meta.isLayout && type !== 'HR') {
        setSettingsNode(node)
        setSettingsPageIndex(targetPageIndex)
      }
      return
    }

    if (activeData?.type === 'canvas') {
      const nodeId = activeData.nodeId
      const fromLoc = findNodeLocation(nodeId)
      if (!fromLoc) return
      const node = getNodeById(nodeId)
      if (!node) return

      if (fromLoc.pageIndex === targetPageIndex && fromLoc.slotKey === targetSlotKey) {
        if (fromLoc.indexInSlot !== targetIndex) {
          reorderComponents(targetPageIndex, targetSlotKey, nodeId, overId)
        }
        return
      }
      moveComponent(fromLoc.pageIndex, fromLoc.slotKey, targetPageIndex, targetSlotKey, node, targetIndex)
    }
  }, [currentPageIndex, pages, allowedComponents, addComponent, reorderComponents, moveComponent, findNodeLocation, getNodeById, generateId])

  const outputSchema = getOutputSchema()
  const schemaStr = JSON.stringify(outputSchema)

  // Test: persist current schema to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('landing-page-designer-schema', schemaStr)
    } catch (_) {}
  }, [schemaStr])

  return (
    <div className="canvas-tab">
      <div className="canvas-tab-toolbar">
        <div className="canvas-tab-pages">
          {pages.map((p, i) => (
            <div key={p.id} className={`canvas-tab-page-tab ${i === currentPageIndex ? 'active' : ''}`}>
              <button type="button" onClick={() => setCurrentPage(i)} className="canvas-tab-page-btn">
                {p.name}
              </button>
              {pages.length > 1 && (
                <button type="button" onClick={() => removePage(i)} className="canvas-tab-page-remove" title="Remove page">×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPage} className="canvas-tab-add-page" title="Add page">+ Add page</button>
        </div>
        <div className="canvas-tab-actions">
          <button
            type="button"
            onClick={() => setIsPreview((v) => !v)}
            className={`canvas-tab-preview-btn ${isPreview ? 'active' : ''}`}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button type="button" onClick={() => setShowJson((v) => !v)} className="canvas-tab-json-toggle">
            {showJson ? 'Hide' : 'Show'} JSON
          </button>
        </div>
      </div>

      <div className="canvas-tab-main">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <ComponentPalette allowedComponents={allowedComponents} />
          <div className="canvas-tab-canvas-wrap">
            <PageCanvas isPreview={false} onSettings={handleSettings} />
          </div>
        </DndContext>
      </div>

      {isPreview && (
        <div
          className="canvas-tab-preview-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsPreview(false) }}
        >
          <div className="canvas-tab-preview-popup canvas-tab-preview-browser" onClick={(e) => e.stopPropagation()}>
            <div className="canvas-tab-preview-browser-titlebar">
              <div className="canvas-tab-preview-browser-dots">
                <span className="canvas-tab-preview-dot canvas-tab-preview-dot-close" />
                <span className="canvas-tab-preview-dot canvas-tab-preview-dot-min" />
                <span className="canvas-tab-preview-dot canvas-tab-preview-dot-max" />
              </div>
              <span className="canvas-tab-preview-browser-title">Preview</span>
              <button
                type="button"
                className="canvas-tab-preview-close"
                onClick={() => setIsPreview(false)}
                title="Close preview"
              >
                ×
              </button>
            </div>
            <div className="canvas-tab-preview-browser-toolbar">
              <div className="canvas-tab-preview-browser-nav">
                <span className="canvas-tab-preview-nav-btn" title="Back">‹</span>
                <span className="canvas-tab-preview-nav-btn" title="Forward">›</span>
                <span className="canvas-tab-preview-nav-btn" title="Refresh">↻</span>
              </div>
              <div className="canvas-tab-preview-browser-address">
                <span className="canvas-tab-preview-address-icon">🔒</span>
                <span className="canvas-tab-preview-address-url">about:preview</span>
              </div>
            </div>
            <div className="canvas-tab-preview-content">
              <DndContext sensors={sensors} onDragEnd={() => {}}>
                <PreviewNavigation
                  pages={pages}
                  templateType={templateType}
                  onSettings={handleSettings}
                />
              </DndContext>
            </div>
            <footer className="canvas-tab-preview-footer">
              Landing page designer - POC - VNext
            </footer>
          </div>
        </div>
      )}

      {showJson && (
        <div
          className="canvas-tab-json-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowJson(false) }}
        >
          <div className="canvas-tab-json-popup" onClick={(e) => e.stopPropagation()}>
            <JsonViewer data={outputSchema} onLoad={loadSchema} onClose={() => setShowJson(false)} />
          </div>
        </div>
      )}

      {settingsNode && (
        <SettingsModal
          node={settingsNode}
          pageIndex={settingsPageIndex ?? currentPageIndex}
          onSave={handleSettingsSave}
          onClose={handleSettingsClose}
        />
      )}
    </div>
  )
}

export default CanvasTab
