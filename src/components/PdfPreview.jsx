import React from 'react'

export default function PdfPreview() {
  // Use the Vite base so the PDF path works both locally and on GitHub Pages.
  // `import.meta.env.BASE_URL` is '/' in dev and the configured `base` in production.
  const pdfUrl = (import.meta.env.BASE_URL || '/') + 'Apostille.pdf'

  return (
    <section className="pdf-preview">
      <div className="preview-top">
        <div>
          <div className="preview-title">e-Apostille Preview</div>
          <div className="preview-sub muted">For visual verification only. Preview link may expire soon.</div>
        </div>
      </div>

      <div className="preview-frame">
        <iframe title="pdf-viewer" src={pdfUrl} frameBorder="0" />
      </div>
    </section>
  )
}
