import { createContext, useContext, useReducer, useCallback } from 'react'

const BuilderContext = createContext(null)

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

const initialTemplate = {
  name: '',
  templateId: 'step-form',
  templateType: 'step-by-step',
  maxSteps: 5,
  maxPages: 10,
  allowedComponents: [
    'Text', 'Image', 'Input', 'Select', 'Checkbox', 'Radio',
    'Textarea', 'Button', 'FileUpload', 'UrlInput',
    'OneColumn', 'TwoColumn', 'ThreeColumn', 'HR'
  ],
  navigation: { next: true, previous: true }
}

function builderReducer(state, action) {
  switch (action.type) {
    case 'SET_TEMPLATE_DETAILS':
      return { ...state, ...action.payload }
    case 'LOAD_SCHEMA': {
      const payload = action.payload
      const pages = (payload.pages || state.pages).map((p, i) => {
        const comps = p.components || []
        const parseNodes = (list) => (list || []).map((c) => {
          const id = `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
          const node = { id, type: c.type, props: c.props || {} }
          if (c.columns) {
            node.slots = c.columns.map(col => parseNodes(col))
          }
          return node
        })
        return {
          id: p.pageId || generateId(),
          name: p.name || `Page ${i + 1}`,
          components: parseNodes(comps)
        }
      })
      return {
        ...state,
        name: payload.name ?? state.name,
        templateId: payload.template ?? state.templateId,
        templateType: payload.templateType ?? state.templateType,
        pages: pages.length ? pages : state.pages,
        currentPageIndex: 0
      }
    }
    case 'ADD_PAGE':
      return {
        ...state,
        pages: [
          ...state.pages,
          { id: generateId(), name: `Page ${state.pages.length + 1}`, components: [] }
        ]
      }
    case 'REMOVE_PAGE': {
      const newPages = state.pages
        .filter((_, i) => i !== action.index)
        .map((p, i) => ({ ...p, name: `Page ${i + 1}` }))
      return {
        ...state,
        pages: newPages,
        currentPageIndex: Math.min(state.currentPageIndex, Math.max(0, newPages.length - 1))
      }
    }
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPageIndex: Math.max(0, Math.min(action.index, state.pages.length - 1)) }
    case 'RENAME_PAGE':
      return {
        ...state,
        pages: state.pages.map((p, i) => i === action.index ? { ...p, name: action.name } : p)
      }
    case 'ADD_COMPONENT': {
      const { pageIndex, slotKey, index, node } = action.payload
      const page = state.pages[pageIndex]
      if (!page) return state
      const newNode = { ...node, id: node.id || generateId() }
      const newPages = [...state.pages]
      if (!slotKey || slotKey === 'root') {
        const comps = [...page.components]
        comps.splice(index ?? comps.length, 0, newNode)
        newPages[pageIndex] = { ...page, components: comps }
      } else {
        const [layoutId, colIndex] = slotKey.split(':').map((x, i) => i === 1 ? parseInt(x, 10) : x)
        const updateLayout = (list) => {
          return list.map(c => {
            if (c.id === layoutId && c.slots) {
              const slots = [...c.slots]
              const col = [...(slots[colIndex] || [])]
              col.splice(index ?? col.length, 0, newNode)
              slots[colIndex] = col
              return { ...c, slots }
            }
            if (c.slots) return { ...c, slots: c.slots.map(updateLayout) }
            return c
          })
        }
        newPages[pageIndex] = { ...page, components: updateLayout(page.components) }
      }
      return { ...state, pages: newPages }
    }
    case 'REMOVE_COMPONENT': {
      const { pageIndex, nodeId } = action.payload
      const removeFrom = (list) =>
        list.reduce((acc, c) => {
          if (c.id === nodeId) return acc
          if (c.slots) {
            acc.push({ ...c, slots: c.slots.map((col) => removeFrom(col)) })
          } else {
            acc.push(c)
          }
          return acc
        }, [])
      const newPages = [...state.pages]
      newPages[pageIndex] = { ...state.pages[pageIndex], components: removeFrom(state.pages[pageIndex].components) }
      return { ...state, pages: newPages }
    }
    case 'UPDATE_COMPONENT': {
      const { pageIndex, nodeId, props } = action.payload
      const updateIn = (list) => list.map(c => {
        if (c.id === nodeId) return { ...c, props: { ...c.props, ...props } }
        if (c.slots) return { ...c, slots: c.slots.map(updateIn) }
        return c
      })
      const newPages = [...state.pages]
      newPages[pageIndex] = { ...state.pages[pageIndex], components: updateIn(state.pages[pageIndex].components) }
      return { ...state, pages: newPages }
    }
    case 'REORDER_COMPONENTS': {
      const { pageIndex, slotKey, activeId, overId } = action.payload
      const page = state.pages[pageIndex]
      if (!page) return state
      const newPages = [...state.pages]
      const swapInSlot = (list, slotK) => {
        if (!slotK || slotK === 'root') {
          const ids = list.map(c => c.id)
          const a = ids.indexOf(activeId)
          const o = ids.indexOf(overId)
          if (a === -1 || o === -1) return list
          const next = [...list]
          const [rem] = next.splice(a, 1)
          next.splice(o, 0, rem)
          return next
        }
        const parts = slotK.split(':')
        const layoutId = parts[0]
        const colIndex = parseInt(parts[1], 10)
        return list.map(c => {
          if (c.id === layoutId && c.slots) {
            const col = [...(c.slots[colIndex] || [])]
            const ids = col.map(x => x.id)
            const a = ids.indexOf(activeId)
            const o = ids.indexOf(overId)
            if (a !== -1 && o !== -1) {
              const [rem] = col.splice(a, 1)
              col.splice(o, 0, rem)
              const slots = [...c.slots]
              slots[colIndex] = col
              return { ...c, slots }
            }
          }
          if (c.slots) return { ...c, slots: c.slots.map((s, i) => swapInSlot(s, `${c.id}:${i}`)) }
          return c
        })
      }
      newPages[pageIndex] = { ...page, components: swapInSlot(page.components, slotKey) }
      return { ...state, pages: newPages }
    }
    case 'MOVE_COMPONENT': {
      const { fromPage, fromSlotKey, toPage, toSlotKey, node, index } = action.payload
      const removeFrom = (list, slotK) => {
        if (!slotK || slotK === 'root') return list.filter(c => c.id !== node.id).map(c => c.slots ? { ...c, slots: c.slots.map((s, i) => removeFrom(s, `${c.id}:${i}`)) } : c)
        const parts = slotK.split(':')
        const layoutId = parts[0]
        const colIndex = parseInt(parts[1], 10)
        return list.map(c => {
          if (c.id === layoutId && c.slots) {
            const slots = [...c.slots]
            slots[colIndex] = (slots[colIndex] || []).filter(x => x.id !== node.id)
            return { ...c, slots }
          }
          if (c.slots) return { ...c, slots: c.slots.map((s, i) => removeFrom(s, `${c.id}:${i}`)) }
          return c
        })
      }
      const addTo = (list, slotK, idx, newNode) => {
        if (!slotK || slotK === 'root') {
          const next = [...list]
          next.splice(idx ?? next.length, 0, newNode)
          return next
        }
        const parts = slotK.split(':')
        const layoutId = parts[0]
        const colIndex = parseInt(parts[1], 10)
        return list.map(c => {
          if (c.id === layoutId && c.slots) {
            const slots = [...c.slots]
            const col = [...(slots[colIndex] || [])]
            col.splice(idx ?? col.length, 0, newNode)
            slots[colIndex] = col
            return { ...c, slots }
          }
          return c
        })
      }
      const newPages = [...state.pages]
      newPages[fromPage] = { ...state.pages[fromPage], components: removeFrom(state.pages[fromPage].components, fromSlotKey) }
      newPages[toPage] = { ...state.pages[toPage], components: addTo(newPages[toPage].components, toSlotKey, index, node) }
      return { ...state, pages: newPages }
    }
    default:
      return state
  }
}

const defaultState = {
  ...initialTemplate,
  pages: [{ id: 'page-0', name: 'Page 1', components: [] }],
  currentPageIndex: 0
}

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(builderReducer, defaultState)

  const addPage = useCallback(() => dispatch({ type: 'ADD_PAGE' }), [])
  const removePage = useCallback((index) => dispatch({ type: 'REMOVE_PAGE', index }), [])
  const setCurrentPage = useCallback((index) => dispatch({ type: 'SET_CURRENT_PAGE', index }), [])
  const renamePage = useCallback((index, name) => dispatch({ type: 'RENAME_PAGE', index, name }), [])
  const setTemplateDetails = useCallback((payload) => dispatch({ type: 'SET_TEMPLATE_DETAILS', payload }), [])
  const loadSchema = useCallback((payload) => dispatch({ type: 'LOAD_SCHEMA', payload }), [])

  const addComponent = useCallback((pageIndex, slotKey, index, node) => {
    dispatch({ type: 'ADD_COMPONENT', payload: { pageIndex, slotKey, index, node } })
  }, [])
  const removeComponent = useCallback((pageIndex, nodeId) => {
    dispatch({ type: 'REMOVE_COMPONENT', payload: { pageIndex, nodeId } })
  }, [])
  const updateComponent = useCallback((pageIndex, nodeId, props) => {
    dispatch({ type: 'UPDATE_COMPONENT', payload: { pageIndex, nodeId, props } })
  }, [])
  const reorderComponents = useCallback((pageIndex, slotKey, activeId, overId) => {
    dispatch({ type: 'REORDER_COMPONENTS', payload: { pageIndex, slotKey, activeId, overId } })
  }, [])
  const moveComponent = useCallback((fromPage, fromSlotKey, toPage, toSlotKey, node, index) => {
    dispatch({ type: 'MOVE_COMPONENT', payload: { fromPage, fromSlotKey, toPage, toSlotKey, node, index } })
  }, [])

  const getOutputSchema = useCallback(() => {
    const serialize = (nodes) => nodes.map(({ id, type, props, slots }) => {
      const out = { type, props: { ...props } }
      if (slots) out.columns = slots.map(col => serialize(col))
      return out
    })
    return {
      template: state.templateId,
      templateType: state.templateType,
      name: state.name,
      pages: state.pages.map(p => ({
        pageId: p.id,
        name: p.name,
        components: serialize(p.components)
      }))
    }
  }, [state])

  function findNodeLocation(nodeId, pages = state.pages) {
    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi]
      const search = (list, slotKey) => {
        for (let i = 0; i < list.length; i++) {
          const c = list[i]
          if (c.id === nodeId) return { pageIndex: pi, slotKey, indexInSlot: i }
          if (c.slots) {
            for (let col = 0; col < c.slots.length; col++) {
              const found = search(c.slots[col], `${c.id}:${col}`)
              if (found) return found
            }
          }
        }
        return null
      }
      const found = search(page.components, 'root')
      if (found) return found
    }
    return null
  }

  function getNodeById(nodeId) {
    const search = (list) => {
      for (const c of list) {
        if (c.id === nodeId) return c
        if (c.slots) for (const col of c.slots) { const n = search(col); if (n) return n }
      }
      return null
    }
    for (const page of state.pages) {
      const n = search(page.components)
      if (n) return n
    }
    return null
  }

  const value = {
    ...state,
    addPage,
    removePage,
    setCurrentPage,
    renamePage,
    setTemplateDetails,
    loadSchema,
    addComponent,
    removeComponent,
    updateComponent,
    reorderComponents,
    moveComponent,
    getOutputSchema,
    findNodeLocation,
    getNodeById,
    generateId
  }

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider')
  return ctx
}
