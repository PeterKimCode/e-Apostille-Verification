import React from 'react'

export default function PdfPreview() {
  // Use the Vite base so the PDF path works both locally and on GitHub Pages.
  // `import.meta.env.BASE_URL` is '/' in dev and the configured `base` in production.
  const pdfUrl = (import.meta.env.BASE_URL || '/') + 'Apostille.pdf#toolbar=0'

  return (
    <section className="pdf-preview">
      <div className="preview-top">
        <div>
          <div className="preview-title">e-Apostille Preview</div>
          <div className="preview-sub muted">For visual verification only. Preview link may expire soon.</div>
        </div>
        <div className="preview-actions">
          <button className="btn view-only">View only</button>
        </div>
      </div>

      <div className="preview-frame">
        <div className="pdf-toolbar" aria-hidden>
          <button className="icon-btn">◀</button>
          <div className="page-indicator">1 / 6</div>
          <button className="icon-btn">▶</button>
          <div style={{flex:1}} />
          <button className="icon-btn">−</button>
          <button className="icon-btn">＋</button>
          <button className="icon-btn">⟳</button>
          <button className="icon-btn">⤓</button>
        </div>
        <iframe title="pdf-viewer" src={pdfUrl} frameBorder="0" />
      </div>
    </section>
  )
}
