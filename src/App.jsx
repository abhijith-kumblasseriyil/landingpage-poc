import { useState, useEffect } from 'react'
import { BuilderProvider } from './context/BuilderContext'
import TemplateDetailsTab from './components/TemplateDetailsTab'
import CanvasTab from './components/CanvasTab'
import IntroTour, { useTourStorage } from './components/IntroTour'
import './App.css'

const TAB_HASHES = ['details', 'canvas']

function tabFromHash() {
  const hash = window.location.hash.slice(1).toLowerCase()
  return TAB_HASHES.includes(hash) ? hash : 'details'
}

function App() {
  const [activeTab, setActiveTab] = useState(tabFromHash)
  const { tourDone, markTourDone, resetTour } = useTourStorage()
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    if (!tourDone) setShowTour(true)
  }, [tourDone])

  useEffect(() => {
    const onHashChange = () => setActiveTab(tabFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const setTab = (tab) => {
    setActiveTab(tab)
    window.history.replaceState(undefined, '', `#${tab}`)
  }

  const handleTourClose = () => {
    markTourDone()
    setShowTour(false)
  }

  const handleTakeTour = () => {
    resetTour()
    setShowTour(true)
  }

  return (
    <BuilderProvider>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Landing page designer - V1</h1>
          <nav className="app-tabs" aria-label="Tabs">
            <button
              type="button"
              data-tour="tab-details"
              className={`app-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setTab('details')}
            >
              Template details
            </button>
            <button
              type="button"
              data-tour="tab-canvas"
              className={`app-tab ${activeTab === 'canvas' ? 'active' : ''}`}
              onClick={() => setTab('canvas')}
            >
              Canvas
            </button>
          </nav>
        </header>
        <main className="app-main">
          {activeTab === 'details' && <TemplateDetailsTab />}
          {activeTab === 'canvas' && <CanvasTab />}
        </main>
        <footer className="app-footer">
          Landing page designer - POC - VNext · Developed by Abhijith KM
          {' · '}
          <button type="button" className="app-footer-tour-link" onClick={handleTakeTour}>
            Take tour
          </button>
        </footer>
      </div>
      {showTour && (
        <IntroTour onClose={handleTourClose} onComplete={handleTourClose} />
      )}
    </BuilderProvider>
  )
}

export default App
