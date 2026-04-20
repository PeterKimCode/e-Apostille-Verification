import React, { useState } from 'react'

function Details({ data }) {
  if (!data) return null
  if (!data.found) return <div className="verification-notfound">No record found.</div>

  return (
    <div className="verification-details">
      <div className="details-header">
        <div className="title">Verification Details</div>
        <div className="badge verified">Verified</div>
      </div>

      <div className="details-grid">
        <div className="label">Serial Number</div>
        <div className="value">26e-0016922</div>

        <div className="label">Signed By</div>
        <div className="value">Rogelio T. Galera, Jr.</div>

        <div className="label">Capacity</div>
        <div className="value">Regional Director</div>

        <div className="label">Seal Of</div>
        <div className="value">Commission on Higher Education</div>
      </div>

      <div className="notice">This preview is for on-screen verification only. Printing or saving is discouraged and may be restricted by policy.</div>

      <div className="card-actions">
        <button className="btn secondary">Refresh</button>
        <button className="btn">Back</button>
      </div>
    </div>
  )
}

function mockVerify(code) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!code || code.length < 10) resolve({ found: false })
      else
        resolve({
          found: true,
          status: 'VALID',
          reference: code,
        })
    }, 600)
  })
}

export default function LeftCard() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  async function handleVerify(e) {
    e && e.preventDefault()
    setLoading(true)
    const res = await mockVerify(code.trim())
    setData(res)
    setLoading(false)
  }

  return (
    <aside className="left-card">
      <div className="card-top">
        <h2>e-Apostille Verification</h2>
        <p className="muted">Public verification portal · Certificate verified</p>
      </div>

      <form className="verify-form" onSubmit={handleVerify}>
        <label>Enter verification code</label>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste code or URL here" />
        <div className="form-actions">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify'}</button>
        </div>
      </form>

      <div className="card-body">
        <Details data={data} />
      </div>
    </aside>
  )
}
