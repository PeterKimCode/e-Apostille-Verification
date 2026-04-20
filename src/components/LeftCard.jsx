import React from 'react'

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

export default function LeftCard() {
  // show details by default (no input required)
  const data = {
    found: true,
    status: 'VALID',
    reference: '26e-0016922'
  }

  return (
    <aside className="left-card">
      <div className="card-top">
        <h2>e-Apostille Verification</h2>
        <p className="muted">Public verification portal · Certificate verified</p>
      </div>

      <div className="card-body">
        <Details data={data} />
      </div>
    </aside>
  )
}
