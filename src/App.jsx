import React from 'react'
import LeftCard from './components/LeftCard'
import PdfPreview from './components/PdfPreview'

export default function App() {
  const now = new Date()
  const timeString = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return (
    <>
      <header className="top-header full-width">
        <div className="header-inner">
          <div className="brand">
            <img src={import.meta.env.BASE_URL + 'Logo.png'} alt="Logo" className="logo-image" />
            <div className="brand-text">
              <div className="country">REPUBLIC OF THE PHILIPPINES</div>
              <div className="brand-title">DEPARTMENT OF FOREIGN AFFAIRS</div>
              <div className="brand-sub">OFFICE OF CONSULAR AFFAIRS<br/>AUTHENTICATION DIVISION</div>
            </div>
          </div>
        </div>
      </header>

      <div className="page-meta">
        <div className="meta-left">
          <div className="meta-badge">
            <span className="meta-icon">✔︎</span>
            <div>
              <div className="meta-title">e-Apostille Verification</div>
              <div className="meta-sub">Public verification portal · Certificate verified</div>
            </div>
          </div>
        </div>
        <div className="meta-right">
          <div className="header-time">{timeString}</div>
        </div>
      </div>

      <div className="app-root layout-two-col">
        <main className="main-grid">
          <LeftCard />
          <PdfPreview />
        </main>
      </div>
    </>
  )
}
