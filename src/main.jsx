import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import './styles.css'
import { getDefaultPageUrl } from './data/records'

const defaultPageUrl = getDefaultPageUrl()

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/verify/:pageUrl" element={<App />} />
        <Route path="/" element={<Navigate to={`/verify/${defaultPageUrl}`} replace />} />
        <Route path="*" element={<Navigate to={`/verify/${defaultPageUrl}`} replace />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
