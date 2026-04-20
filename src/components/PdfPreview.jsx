import React from 'react'
import { useParams } from 'react-router-dom'
import mockData from '../data/mockData.json'

export default function PdfPreview() {
  const { serialNumber } = useParams()
  const record = mockData.find(r => r.serialNumber === serialNumber)

  const base = import.meta.env.BASE_URL || '/'
  const pdfUrl = record ? (base + record.pdfUrl.replace(/^\//, '') + '#navpanes=0') : null

  return (
    <section className="pdf-preview">
      <div className="preview-top">
        <div>
          <div className="preview-title">e-Apostille Preview</div>
          <div className="preview-sub muted">For visual verification only. Preview link may expire soon.</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="preview-actions">
            <button className="btn view-only">View only</button>
          </div>
        </div>
      </div>

      <div className="preview-frame">
        {pdfUrl ? (
          <iframe title="pdf-viewer" src={pdfUrl} frameBorder="0" />
        ) : (
          <div style={{padding:24}}>No document available for this serial number.</div>
        )}
      </div>
    </section>
  )
}
