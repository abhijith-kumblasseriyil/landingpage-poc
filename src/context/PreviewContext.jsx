import { createContext, useContext, useRef, useCallback } from 'react'

const PreviewContext = createContext(null)

export function PreviewProvider({ children, goNext, goPrev, previewPageIndex, totalPages }) {
  const formRef = useRef(null)

  const setFormRef = useCallback((el) => {
    formRef.current = el
  }, [])

  const validateCurrentPage = useCallback(() => {
    if (!formRef.current) return true
    return formRef.current.checkValidity()
  }, [])

  const reportValidity = useCallback(() => {
    if (!formRef.current) return true
    formRef.current.reportValidity()
    return formRef.current.checkValidity()
  }, [])

  const value = {
    goNext,
    goPrev,
    setFormRef,
    validateCurrentPage,
    reportValidity,
    previewPageIndex,
    totalPages
  }

  return (
    <PreviewContext.Provider value={value}>
      {children}
    </PreviewContext.Provider>
  )
}

export function usePreview() {
  const ctx = useContext(PreviewContext)
  return ctx
}
