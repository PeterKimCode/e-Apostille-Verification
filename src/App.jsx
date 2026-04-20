import React from 'react'
import VerifyForm from './components/VerifyForm'

export default function App() {
  return (
    <div className="app-root">
      <header className="site-header">
        <h1>e-Apostille Verification (Demo)</h1>
        <p className="subtitle">Enter verification code to view details</p>
      </header>
      <main className="content">
        <VerifyForm />
      </main>
      <footer className="site-footer">Demo — Not an official site</footer>
    </div>
  )
}
