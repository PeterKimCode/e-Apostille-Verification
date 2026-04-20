import React, { useState } from 'react'

function mockVerify(code) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!code || code.length < 10) {
        resolve({ found: false })
      } else {
        resolve({
          found: true,
          status: 'VALID',
          reference: code,
          issuedOn: '2024-06-15',
          issuer: 'Office of the Secretary',
          docType: 'Birth Certificate',
          holder: 'Juan dela Cruz'
        })
      }
    }, 700)
  })
}

export default function VerifyForm() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleVerify(e) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    const res = await mockVerify(code.trim())
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="verify-box">
      <form onSubmit={handleVerify} className="verify-form">
        <label htmlFor="code">Verification Code</label>
        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter or paste verification code"
        />
        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          {!result.found ? (
            <div className="not-found">No record found for that code.</div>
          ) : (
            <div className="found">
              <div className="status">Status: <strong>{result.status}</strong></div>
              <div>Reference: {result.reference}</div>
              <div>Issued On: {result.issuedOn}</div>
              <div>Type: {result.docType}</div>
              <div>Holder: {result.holder}</div>
              <div>Issuer: {result.issuer}</div>
              <div className="external-link">
                <a
                  href={`https://e-registry.apostille.gov.ph/v2/e-apostille?q=${encodeURIComponent(result.reference)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open official registry (original)
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
