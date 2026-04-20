import React from 'react'

export default function PdfPreview() {
  // Load the local PDF directly. Using the external PDF.js viewer caused the
  // blank page due to cross-origin / viewer restrictions. Serving the PDF
  // directly ensures the browser can render it at /register.pdf.
  const pdfUrl = '/register.pdf'

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
