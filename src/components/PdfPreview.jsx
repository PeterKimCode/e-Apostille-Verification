import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { findRecordByPageUrl } from '../data/records'

function ToolbarButton({ children, title, onClick, disabled = false }) {
  return (
    <button
      className="preview-toolbar-btn"
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

function Icon({ children }) {
  return <span className="preview-toolbar-icon" aria-hidden="true">{children}</span>
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
        const containerWidth = Math.max(container.clientWidth - 32, 320)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (disposed) return

          const page = await pdf.getPage(pageNumber)
          const firstViewport = page.getViewport({ scale: 1, rotation })
          const scale = Math.min((containerWidth / firstViewport.width) * zoom, 2.4)
          const viewport = page.getViewport({ scale, rotation })
          const outputScale = window.devicePixelRatio || 1
          const pageShell = document.createElement('section')
          const pageLabel = document.createElement('div')
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d', { alpha: false })

          if (!context) {
            throw new Error('Canvas rendering is not available in this browser.')
          }

          pageShell.className = 'pdf-page-shell'
          pageShell.dataset.pageNumber = String(pageNumber)
          pageLabel.className = 'pdf-page-label'
          pageLabel.textContent = `Page ${pageNumber}`
          canvas.className = 'pdf-page-canvas'
          canvas.width = Math.floor(viewport.width * outputScale)
          canvas.height = Math.floor(viewport.height * outputScale)
          canvas.style.width = `${Math.floor(viewport.width)}px`
          canvas.style.height = `${Math.floor(viewport.height)}px`

          pageShell.appendChild(pageLabel)
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
          setCurrentPage((prev) => Math.min(prev, pdf.numPages))
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

    printWindow.addEventListener('load', () => {
      printWindow.print()
    }, { once: true })
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
                <div className="preview-page-indicator">{currentPage} / {Math.max(pageCount, 1)}</div>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Zoom out" onClick={handleZoomOut} disabled={!canInteract}>
                  <Icon>-</Icon>
                </ToolbarButton>
                <ToolbarButton title="Zoom in" onClick={handleZoomIn} disabled={!canInteract}>
                  <Icon>+</Icon>
                </ToolbarButton>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Rotate counterclockwise" onClick={handleRotateBack} disabled={!canInteract}>
                  <Icon>&#8634;</Icon>
                </ToolbarButton>
                <ToolbarButton title="Rotate clockwise" onClick={handleRotate} disabled={!canInteract}>
                  <Icon>&#8635;</Icon>
                </ToolbarButton>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Go to previous view" onClick={handlePreviousView} disabled={!canInteract || currentPage <= 1}>
                  <Icon>&#8630;</Icon>
                </ToolbarButton>
                <ToolbarButton title="Go to next view" onClick={handleNextView} disabled={!canInteract || currentPage >= pageCount}>
                  <Icon>&#8631;</Icon>
                </ToolbarButton>
              </div>

              <ToolbarSeparator />

              <div className="preview-toolbar-group">
                <ToolbarButton title="Reset view" onClick={handleReset} disabled={!canInteract}>
                  <Icon>&#8962;</Icon>
                </ToolbarButton>
                <ToolbarButton title="Download PDF" onClick={handleDownload} disabled={!pdfUrl}>
                  <Icon>&#8595;</Icon>
                </ToolbarButton>
                <ToolbarButton title="Print PDF" onClick={handlePrint} disabled={!pdfUrl}>
                  <Icon>&#9113;</Icon>
                </ToolbarButton>
                <ToolbarButton title="More options" onClick={handleDownload} disabled={!pdfUrl}>
                  <Icon>&#8942;</Icon>
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
