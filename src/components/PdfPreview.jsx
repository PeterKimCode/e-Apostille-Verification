import React from 'react'

export default function PdfPreview() {
  // Use the Vite base so the PDF path works both locally and on GitHub Pages.
  // `import.meta.env.BASE_URL` is '/' in dev and the configured `base` in production.
  // hide navigation pane (thumbnails) where supported using PDF fragment param
  const pdfUrl = (import.meta.env.BASE_URL || '/') + 'Apostille.pdf#navpanes=0'

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
        <iframe title="pdf-viewer" src={pdfUrl} frameBorder="0" />
      </div>
    </section>
  )
}
