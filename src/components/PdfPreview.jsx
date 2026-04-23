import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { findRecordByPageUrl } from '../data/records'

function ToolbarButton({ children, title, onClick, disabled = false, compact = false }) {
  return (
    <button
      className={`preview-toolbar-btn${compact ? ' preview-toolbar-btn-compact' : ''}`}
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function ToolbarSeparator() {
  return <div className="preview-toolbar-separator" aria-hidden="true" />
}

function ToolbarIcon({ children }) {
  return (
    <svg className="preview-toolbar-icon" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

export default function PdfPreview() {
  const { pageUrl } = useParams()
  const record = findRecordByPageUrl(pageUrl)
  const pagesRef = useRef(null)
  const [previewState, setPreviewState] = useState('idle')
  const [previewError, setPreviewError] = useState('')
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const base = import.meta.env.BASE_URL || '/'
  const pdfUrl = record
    ? new URL(record.pdfUrl.replace(/^\//, ''), window.location.origin + base).toString()
    : null

  useEffect(() => {
    setCurrentPage(1)
    setZoom(1)
    setRotation(0)
  }, [pdfUrl])

  useEffect(() => {
    let disposed = false
    let loadingTask = null

    async function renderPreview() {
      if (!pagesRef.current) return

      pagesRef.current.innerHTML = ''
      setPreviewError('')

      if (!pdfUrl) {
        setPageCount(0)
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
        const containerWidth = Math.max(container.clientWidth - 56, 320)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (disposed) return

          const page = await pdf.getPage(pageNumber)
          const firstViewport = page.getViewport({ scale: 1, rotation })
          const scale = Math.min((containerWidth / firstViewport.width) * zoom, 2.4)
          const viewport = page.getViewport({ scale, rotation })
          const outputScale = window.devicePixelRatio || 1
          const pageShell = document.createElement('section')
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d', { alpha: false })

          if (!context) {
            throw new Error('Canvas rendering is not available in this browser.')
          }

          pageShell.className = 'pdf-page-shell'
          pageShell.dataset.pageNumber = String(pageNumber)
          canvas.className = 'pdf-page-canvas'
          canvas.width = Math.floor(viewport.width * outputScale)
          canvas.height = Math.floor(viewport.height * outputScale)
          canvas.style.width = `${Math.floor(viewport.width)}px`
          canvas.style.height = `${Math.floor(viewport.height)}px`

          pageShell.appendChild(canvas)
          container.appendChild(pageShell)

          await page.render({
            canvasContext: context,
            transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
            viewport
          }).promise
        }

        if (!disposed) {
          setPageCount(pdf.numPages)
          setCurrentPage((prev) => Math.min(Math.max(prev, 1), pdf.numPages))
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
  }, [pdfUrl, zoom, rotation])

  useEffect(() => {
    if (!pagesRef.current || previewState !== 'ready') return undefined

    const container = pagesRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visibleEntry) return

        const nextPage = Number(visibleEntry.target.dataset.pageNumber || '1')
        setCurrentPage(nextPage)
      },
      {
        root: container,
        threshold: [0.35, 0.6, 0.85]
      }
    )

    const pageNodes = container.querySelectorAll('.pdf-page-shell')
    pageNodes.forEach((node) => observer.observe(node))

    return () => {
      observer.disconnect()
    }
  }, [previewState, pageCount, zoom, rotation])

  function scrollToPage(pageNumber) {
    if (!pagesRef.current) return

    const target = pagesRef.current.querySelector(`[data-page-number="${pageNumber}"]`)
    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setCurrentPage(pageNumber)
  }

  function handleZoomIn() {
    setZoom((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 2.4))
  }

  function handleZoomOut() {
    setZoom((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.55))
  }

  function handleRotate() {
    setRotation((prev) => (prev + 90) % 360)
  }

  function handleRotateBack() {
    setRotation((prev) => (prev + 270) % 360)
  }

  function handleReset() {
    setZoom(1)
    setRotation(0)
    scrollToPage(1)
  }

  function handlePreviousView() {
    scrollToPage(Math.max(1, currentPage - 1))
  }

  function handleNextView() {
    scrollToPage(Math.min(pageCount, currentPage + 1))
  }

  function handleDownload() {
    if (!pdfUrl) return
    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  function handlePrint() {
    if (!pdfUrl) return

    const printWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    if (!printWindow) return

    printWindow.addEventListener(
      'load',
      () => {
        printWindow.print()
      },
      { once: true }
    )
  }

  const canInteract = previewState === 'ready' && pageCount > 0

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
      <div className="panel-header-accent panel-header-accent-preview" aria-hidden="true">
        <div className="panel-header-shade" />
        <div className="panel-header-line" />
      </div>

      <div className="preview-frame">
        {previewState === 'missing' ? (
          <div style={{ padding: 24 }}>No document available for this page URL.</div>
        ) : (
          <div className="preview-doc">
            <div className="preview-toolbar">
              <div className="preview-toolbar-group preview-toolbar-group-page">
                <div className="preview-page-indicator">
                  <span>{currentPage}</span>
                  <span>/</span>
                  <span>{Math.max(pageCount, 1)}</span>
                </div>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Zoom out" onClick={handleZoomOut} disabled={!canInteract}>
                  <ToolbarIcon>
                    <path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </ToolbarIcon>
                </ToolbarButton>
                <ToolbarButton title="Zoom in" onClick={handleZoomIn} disabled={!canInteract}>
                  <ToolbarIcon>
                    <path d="M12 6v12M6 12h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </ToolbarIcon>
                </ToolbarButton>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Rotate counterclockwise" onClick={handleRotateBack} disabled={!canInteract}>
                  <ToolbarIcon>
                    <path d="M8 8H4v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 11a7 7 0 1 0 2-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </ToolbarIcon>
                </ToolbarButton>
                <ToolbarButton title="Rotate clockwise" onClick={handleRotate} disabled={!canInteract}>
                  <ToolbarIcon>
                    <path d="M16 8h4v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 11a7 7 0 1 1-2-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </ToolbarIcon>
                </ToolbarButton>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Previous page" onClick={handlePreviousView} disabled={!canInteract || currentPage <= 1}>
                  <ToolbarIcon>
                    <path d="M14 7l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </ToolbarIcon>
                </ToolbarButton>
                <ToolbarButton title="Next page" onClick={handleNextView} disabled={!canInteract || currentPage >= pageCount}>
                  <ToolbarIcon>
                    <path d="M10 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </ToolbarIcon>
                </ToolbarButton>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Reset view" onClick={handleReset} disabled={!canInteract}>
                  <ToolbarIcon>
                    <path d="M12 5v3M9.5 6.5L12 4l2.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 11a5 5 0 1 0 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </ToolbarIcon>
                </ToolbarButton>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Download PDF" onClick={handleDownload} disabled={!pdfUrl} compact>
                  <ToolbarIcon>
                    <path d="M12 5v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M8.5 11.5 12 15l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 18h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </ToolbarIcon>
                </ToolbarButton>
                <ToolbarButton title="Print PDF" onClick={handlePrint} disabled={!pdfUrl} compact>
                  <ToolbarIcon>
                    <path d="M8 9V5h8v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="6" y="11" width="12" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 14h8v5H8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  </ToolbarIcon>
                </ToolbarButton>
                <ToolbarButton title="More options" onClick={handleDownload} disabled={!pdfUrl} compact>
                  <ToolbarIcon>
                    <circle cx="12" cy="6.5" r="1.2" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                    <circle cx="12" cy="17.5" r="1.2" fill="currentColor" />
                  </ToolbarIcon>
                </ToolbarButton>
              </div>
            </div>

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
          </div>
        )}
      </div>
    </section>
  )
}
