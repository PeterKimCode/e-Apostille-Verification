import React from 'react'
import { useParams } from 'react-router-dom'
import { findRecordByPageUrl } from '../data/records'

function Details({ record }) {
  if (!record) return <div className="verification-notfound">The document URL is invalid.</div>

  return (
    <div className="verification-details">
      <div className="details-header">
        <div>
          <div className="title">Verification Details</div>
          <div className="details-sub">This certificate is valid and matches the registry record.</div>
        </div>
        <div className="badge verified"><span className="dot" />Verified</div>
      </div>

      <div className="details-grid">
        <div className="label">Serial Number</div>
        <div className="value">{record.serialNumber}</div>

        <div className="label">Signed By</div>
        <div className="value">{record.signedBy}</div>

        <div className="label">Capacity</div>
        <div className="value">{record.capacity}</div>

        <div className="label">Seal Of</div>
        <div className="value">{record.sealOf}</div>
      </div>

      <div className="notice"><strong>Notice:</strong> This preview is for on-screen verification only. Printing or saving is discouraged and may be restricted by policy.</div>
    </div>
  )
}

export default function LeftCard() {
  const { pageUrl } = useParams()
  const record = findRecordByPageUrl(pageUrl)

  function handleRefresh() {
    window.location.reload()
  }

  function handleBack() {
    window.location.href = 'https://e-registry.apostille.gov.ph/'
  }

  return (
    <aside className="left-card">
      <div className="card-body">
        <Details record={record} />
        <div className="card-actions bottom-actions">
          <button className="btn primary" type="button" onClick={handleRefresh}>Refresh</button>
          <button className="btn secondary" type="button" onClick={handleBack}>Back</button>
        </div>
      </div>
    </aside>
  )
}
