import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import './PDFViewer.css'

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const PDFViewer = ({ file, className = '', onLoadSuccess, onLoadError }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setPageNumber(1)
    setError(null)
    setLoading(false)
    if (onLoadSuccess) {
      onLoadSuccess({ numPages })
    }
  }

  const onDocumentLoadError = error => {
    setError(error.message || 'Failed to load PDF')
    setLoading(false)
    if (onLoadError) {
      onLoadError(error)
    }
  }

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages))
  }

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const resetZoom = () => {
    setScale(1.0)
  }

  if (!file) {
    return (
      <div className={`pdf-viewer-error ${className}`} data-testid='pdf-viewer-no-file'>
        No PDF file provided
      </div>
    )
  }

  return (
    <div className={`pdf-viewer ${className}`} data-testid='pdf-viewer'>
      {/* Controls */}
      <div className='pdf-controls' data-testid='pdf-controls'>
        {/* Navigation Controls */}
        <div className='pdf-navigation'>
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            data-testid='prev-page-btn'
            aria-label='Previous page'
          >
            ← Previous
          </button>
          <span className='page-info' data-testid='page-info'>
            Page {pageNumber} of {numPages || '?'}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            data-testid='next-page-btn'
            aria-label='Next page'
          >
            Next →
          </button>
        </div>

        {/* Zoom Controls */}
        <div className='pdf-zoom'>
          <button onClick={zoomOut} data-testid='zoom-out-btn' aria-label='Zoom out'>
            -
          </button>
          <span className='zoom-info' data-testid='zoom-info'>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={zoomIn} data-testid='zoom-in-btn' aria-label='Zoom in'>
            +
          </button>
          <button onClick={resetZoom} data-testid='reset-zoom-btn' aria-label='Reset zoom'>
            Reset
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className='pdf-error' data-testid='pdf-error'>
          Error: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className='pdf-loading' data-testid='pdf-loading'>
          Loading PDF...
        </div>
      )}

      {/* PDF Document */}
      <div className='pdf-document' data-testid='pdf-document'>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className='pdf-loading' data-testid='pdf-loading'>
              Loading PDF...
            </div>
          }
          error={
            <div className='pdf-error' data-testid='pdf-document-error'>
              Failed to load PDF file.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading={
              <div className='page-loading' data-testid='page-loading'>
                Loading page...
              </div>
            }
            error={
              <div className='page-error' data-testid='page-error'>
                Failed to load page.
              </div>
            }
          />
        </Document>
      </div>
    </div>
  )
}

export default PDFViewer
