import React from 'react'

export default function PdfPreview() {
  // Use PDF.js hosted viewer so the embedded PDF shows a toolbar similar to the screenshot.
  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  const viewer = 'https://mozilla.github.io/pdf.js/web/viewer.html?file='
  const src = viewer + encodeURIComponent(pdfUrl)

  return (
    <section className="pdf-preview">
      <div className="preview-top">
        <div>
          <div className="preview-title">e-Apostille Preview</div>
          <div className="preview-sub muted">For visual verification only. Preview link may expire soon.</div>
        </div>
        <div className="file-label">@file:register.pdf</div>
      </div>

      <div className="preview-frame">
        <iframe title="pdf-viewer" src={src} frameBorder="0" />
      </div>
    </section>
  )
}
