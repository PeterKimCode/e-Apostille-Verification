import React from 'react'
import LeftCard from './components/LeftCard'
import PdfPreview from './components/PdfPreview'

export default function App() {
  const now = new Date()
  const datePart = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const timePart = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const timeString = `${datePart} ${timePart}`

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
            <svg className="meta-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5v6c0 5 4 10 8 11 4-1 8-6 8-11V5l-8-3z" fill="#e6f7ef"/>
              <path d="M9.5 12.5l1.8 1.8L15 10.6" stroke="#28a745" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
