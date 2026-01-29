import { useState } from 'react'
import { BuilderProvider } from './context/BuilderContext'
import TemplateDetailsTab from './components/TemplateDetailsTab'
import CanvasTab from './components/CanvasTab'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('details')

  return (
    <BuilderProvider>
      <header className="app-header">
        <h1 className="app-title">Landing page designer - V1</h1>
        <nav className="app-tabs" aria-label="Tabs">
          <button
            type="button"
            className={`app-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Template details
          </button>
          <button
            type="button"
            className={`app-tab ${activeTab === 'canvas' ? 'active' : ''}`}
            onClick={() => setActiveTab('canvas')}
          >
            Canvas
          </button>
        </nav>
      </header>
      <div className="app">
        <main className="app-main">
          {activeTab === 'details' && <TemplateDetailsTab />}
          {activeTab === 'canvas' && <CanvasTab />}
        </main>
        <footer className="app-footer">
          Landing page designer - POC - VNext
        </footer>
      </div>
    </BuilderProvider>
  )
}

export default App
