import React from 'react'
import LeftCard from './components/LeftCard'
import PdfPreview from './components/PdfPreview'

export default function App() {
  const now = new Date()
  const timeString = now.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })

  return (
    <div className="app-root layout-two-col">
      <header className="top-header">
        <div className="header-inner">
          <div className="brand">
            <img src={import.meta.env.BASE_URL + 'Logo.png'} alt="Logo" className="logo-image" />
            <div className="brand-text">
              <div className="brand-title">DEPARTMENT OF FOREIGN AFFAIRS</div>
              <div className="brand-sub">Office of Consular Affairs</div>
            </div>
          </div>
          <div className="header-right">
            <div className="header-time">{timeString}</div>
            <div className="header-title">e-Apostille Verification</div>
          </div>
        </div>
      </header>

      <main className="main-grid">
        <LeftCard />
        <PdfPreview />
      </main>

      <footer className="site-footer">Demo — Not an official site</footer>
    </div>
  )
}
