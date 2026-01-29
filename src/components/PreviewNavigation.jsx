import { useState } from 'react'
import { PreviewProvider } from '../context/PreviewContext'
import PageCanvas from './PageCanvas'
import './PreviewNavigation.css'

function PreviewNavigation({ pages, templateType, onSettings }) {
  const [previewPageIndex, setPreviewPageIndex] = useState(0)
  const total = pages.length
  const isStepByStep = templateType === 'step-by-step'

  const goPrev = () => setPreviewPageIndex((i) => Math.max(0, i - 1))
  const goNext = () => setPreviewPageIndex((i) => Math.min(total - 1, i + 1))

  const previewContextValue = {
    goNext,
    goPrev,
    previewPageIndex,
    totalPages: total
  }

  if (total === 0) return null
  if (total === 1) {
    return (
      <PreviewProvider {...previewContextValue}>
        <div className="preview-navigation preview-navigation-single">
          <PageCanvas isPreview onSettings={onSettings} previewPageIndex={0} />
        </div>
      </PreviewProvider>
    )
  }

  const currentPage = pages[previewPageIndex]

  return (
    <PreviewProvider {...previewContextValue}>
    <div className="preview-navigation">
      {isStepByStep ? (
        <div className="preview-wizard">
          <div className="preview-wizard-steps" aria-label="Progress">
            {pages.map((p, i) => (
              <div
                key={p.id}
                className={`preview-wizard-step ${i === previewPageIndex ? 'active' : ''} ${i < previewPageIndex ? 'completed' : ''}`}
              >
                <span className="preview-wizard-step-number">{i + 1}</span>
                <span className="preview-wizard-step-label">{p.name}</span>
                {i < total - 1 && <span className="preview-wizard-step-connector" />}
              </div>
            ))}
          </div>
          <div className="preview-wizard-content">
            <div className="preview-wizard-step-title">
              Step {previewPageIndex + 1} of {total}: {currentPage?.name}
            </div>
            <PageCanvas isPreview onSettings={onSettings} previewPageIndex={previewPageIndex} />
          </div>
        </div>
      ) : (
        <div className="preview-multipage">
          <div className="preview-multipage-header">
            <span className="preview-multipage-label">
              Page {previewPageIndex + 1} of {total}: {currentPage?.name}
            </span>
          </div>
          <PageCanvas isPreview onSettings={onSettings} previewPageIndex={previewPageIndex} />
        </div>
      )}
    </div>
    </PreviewProvider>
  )
}

export default PreviewNavigation
