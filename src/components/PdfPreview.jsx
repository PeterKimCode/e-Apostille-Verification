import React from 'react'

export default function PdfPreview() {
  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'

  return (
    <section className="pdf-preview">
      <div className="preview-top">
        <div className="preview-title">e-Apostille Preview</div>
        <div className="preview-sub muted">For visual verification only. Preview link may expire soon.</div>
      </div>

      <div className="preview-frame">
        <iframe title="pdf" src={pdfUrl} frameBorder="0" />
      </div>
    </section>
  )
}
