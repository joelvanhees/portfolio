import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AppFallback from './components/AppFallback.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary label="app" fallback={<AppFallback />}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
