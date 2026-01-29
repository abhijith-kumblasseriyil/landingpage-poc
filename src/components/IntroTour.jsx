import { useState, useEffect } from 'react'
import './IntroTour.css'

const TOUR_STORAGE_KEY = 'landing-page-designer-tour-done'

const STEPS = [
  {
    title: 'Welcome',
    content: 'Welcome to Landing Page Designer. This short tour will show you the main features. You can skip anytime.',
    target: null
  },
  {
    title: 'Template details',
    content: 'Use this tab to set your template name, form name/ID, logo URL, and template type (step-by-step or multi-page).',
    target: '[data-tour="tab-details"]'
  },
  {
    title: 'Canvas',
    content: 'Switch to the Canvas tab to build your page. Drag components from the palette on the left and drop them on the canvas. Hover over a component to see settings and delete.',
    target: '[data-tour="tab-canvas"]'
  },
  {
    title: 'Preview & JSON',
    content: 'Click Preview to open your page in a browser-style window. Use Show JSON to view or copy the schema, and load JSON to import a saved design.',
    target: null
  },
  {
    title: "You're all set",
    content: "Start by opening Template details, then switch to Canvas and drag components to build your landing page. Click 'Take tour' in the footer to see this again.",
    target: null
  }
]

export function useTourStorage() {
  const [tourDone, setTourDone] = useState(() => {
    try {
      return localStorage.getItem(TOUR_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const markTourDone = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true')
      setTourDone(true)
    } catch {}
  }

  const resetTour = () => {
    try {
      localStorage.removeItem(TOUR_STORAGE_KEY)
      setTourDone(false)
    } catch {}
  }

  return { tourDone, markTourDone, resetTour }
}

function IntroTour({ onClose, onComplete }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  useEffect(() => {
    if (current?.target) {
      const el = document.querySelector(current.target)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [step, current?.target])

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      onComplete?.()
      onClose?.()
    }
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const handleSkip = () => {
    onComplete?.()
    onClose?.()
  }

  return (
    <div className="intro-tour-overlay" role="dialog" aria-modal="true" aria-labelledby="intro-tour-title">
      <div className="intro-tour-backdrop" onClick={handleSkip} />
      <div className="intro-tour-modal">
        <div className="intro-tour-header">
          <h2 id="intro-tour-title" className="intro-tour-title">{current?.title}</h2>
          <button type="button" className="intro-tour-skip" onClick={handleSkip} aria-label="Skip tour">
            Skip
          </button>
        </div>
        <div className="intro-tour-body">
          <p className="intro-tour-content">{current?.content}</p>
        </div>
        <div className="intro-tour-footer">
          <span className="intro-tour-progress">
            {step + 1} of {STEPS.length}
          </span>
          <div className="intro-tour-actions">
            {step > 0 ? (
              <button type="button" className="intro-tour-btn intro-tour-back" onClick={handleBack}>
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="button" className="intro-tour-btn intro-tour-next" onClick={handleNext}>
              {step === STEPS.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntroTour
