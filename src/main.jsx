import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'

import { ThemeProvider } from './providers/ThemeProvider.jsx'
import { WindowSizeProvider } from "./providers/WindowSizeProvider"
import { IdiomaProvider } from "./providers/IdiomaProvider"
import { AuthProvider } from "./providers/AuthProvider"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
      <ThemeProvider>
        <WindowSizeProvider>
          <IdiomaProvider>
            <App />
          </IdiomaProvider>
        </WindowSizeProvider>
      </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
