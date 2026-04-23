import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import mockData from '../data/mockData.json'

export default function PdfPreview() {
  const { serialNumber } = useParams()
  const record = mockData.find((item) => item.serialNumber === serialNumber)
  const pagesRef = useRef(null)
  const [previewState, setPreviewState] = useState('idle')
  const [previewError, setPreviewError] = useState('')
  const [pageCount, setPageCount] = useState(0)

  const base = import.meta.env.BASE_URL || '/'
  const pdfUrl = record
    ? new URL(record.pdfUrl.replace(/^\//, ''), window.location.origin + base).toString()
    : null

  useEffect(() => {
    let disposed = false
    let loadingTask = null

    async function renderPreview() {
      if (!pagesRef.current) return

      pagesRef.current.innerHTML = ''
      setPageCount(0)
      setPreviewError('')

      if (!pdfUrl) {
        setPreviewState('missing')
        return
      }

      setPreviewState('loading')

      try {
        const [{ default: pdfWorker }, pdfjs] = await Promise.all([
          import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
          import('pdfjs-dist')
        ])

        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker
        loadingTask = pdfjs.getDocument(pdfUrl)
        const pdf = await loadingTask.promise
        const container = pagesRef.current
        const containerWidth = Math.max(container.clientWidth - 16, 320)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (disposed) return

          const page = await pdf.getPage(pageNumber)
          const firstViewport = page.getViewport({ scale: 1 })
          const scale = Math.min(containerWidth / firstViewport.width, 1.35)
          const viewport = page.getViewport({ scale })
          const outputScale = window.devicePixelRatio || 1
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d', { alpha: false })

          if (!context) {
            throw new Error('Canvas rendering is not available in this browser.')
          }

          canvas.className = 'pdf-page-canvas'
          canvas.width = Math.floor(viewport.width * outputScale)
          canvas.height = Math.floor(viewport.height * outputScale)
          canvas.style.width = `${Math.floor(viewport.width)}px`
          canvas.style.height = `${Math.floor(viewport.height)}px`

          container.appendChild(canvas)

          await page.render({
            canvasContext: context,
            transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
            viewport
          }).promise
        }

        if (!disposed) {
          setPageCount(pdf.numPages)
          setPreviewState('ready')
        }
      } catch (error) {
        if (!disposed) {
          setPreviewState('error')
          setPreviewError(error instanceof Error ? error.message : 'Unable to load this PDF preview.')
        }
      }
    }

    renderPreview()

    return () => {
      disposed = true
      if (loadingTask) {
        loadingTask.destroy()
      }
    }
  }, [pdfUrl])

  return (
    <section className="pdf-preview">
      <div className="preview-top">
        <div>
          <div className="preview-title">e-Apostille Preview</div>
          <div className="preview-sub muted">For visual verification only. Preview link may expire soon.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="preview-actions">
            <button className="btn view-only">View only</button>
          </div>
        </div>
      </div>

      <div className="preview-frame">
        {previewState === 'missing' ? (
          <div style={{ padding: 24 }}>No document available for this serial number.</div>
        ) : (
          <div className="preview-doc">
            {previewState === 'loading' && <div className="preview-status">Loading PDF preview...</div>}
            {previewState === 'error' && (
              <div className="preview-status preview-status-error">
                <div>Preview could not be rendered in-page.</div>
                <div className="preview-help">{previewError}</div>
                {pdfUrl && (
                  <a className="preview-link" href={pdfUrl} target="_blank" rel="noreferrer">
                    Open PDF in a new tab
                  </a>
                )}
              </div>
            )}
            <div ref={pagesRef} className="preview-pages" aria-label="PDF preview pages" />
            {previewState === 'ready' && pageCount > 0 && (
              <div className="preview-page-count">{pageCount} page{pageCount > 1 ? 's' : ''} loaded</div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
