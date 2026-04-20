import React from 'react'
import LeftCard from './components/LeftCard'
import PdfPreview from './components/PdfPreview'

export default function App() {
  return (
    <div className="app-root layout-two-col">
      <header className="top-header">
        <div className="header-inner">
          <div className="brand">
            <div className="logo-placeholder">DFA</div>
            <div className="brand-text">
              <div className="brand-title">DEPARTMENT OF FOREIGN AFFAIRS</div>
              <div className="brand-sub">Office of Consular Affairs</div>
            </div>
          </div>
          <div className="header-right">e-Apostille Verification</div>
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
