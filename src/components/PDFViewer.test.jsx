import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom'

import PDFViewer from './PDFViewer'

// Mock react-pdf
jest.mock('react-pdf', () => ({
  Document: ({ children, onLoadSuccess, loading, error }) => {
    // Simulate different states based on props
    if (error) {
      return <div data-testid='pdf-document-error'>{error}</div>
    }
    if (loading) {
      return <div data-testid='pdf-loading'>{loading}</div>
    }
    // Trigger the callback immediately for testing
    if (onLoadSuccess) {
      setTimeout(() => onLoadSuccess({ numPages: 3 }), 0)
    }
    return <div data-testid='mock-document'>{children}</div>
  },
  Page: ({ pageNumber, scale, loading, error }) => {
    if (error) {
      return <div data-testid='page-error'>{error}</div>
    }
    if (loading) {
      return <div data-testid='page-loading'>{loading}</div>
    }
    return (
      <div data-testid='mock-page'>
        Page {pageNumber} at {scale}x scale
      </div>
    )
  },
  pdfjs: {
    version: '3.11.174',
    GlobalWorkerOptions: {
      workerSrc: '',
    },
  },
}))

// Mock CSS imports
jest.mock('react-pdf/dist/esm/Page/AnnotationLayer.css', () => ({}))
jest.mock('react-pdf/dist/esm/Page/TextLayer.css', () => ({}))
jest.mock('./PDFViewer.css', () => ({}))

describe('PDFViewer Component', () => {
  const mockFile = '/test.pdf'
  const mockOnLoadSuccess = jest.fn()
  const mockOnLoadError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders without file', () => {
      render(<PDFViewer />)
      expect(screen.getByTestId('pdf-viewer-no-file')).toBeInTheDocument()
      expect(screen.getByText('No PDF file provided')).toBeInTheDocument()
    })

    test('renders with file prop', async () => {
      render(<PDFViewer file={mockFile} />)

      expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument()
      expect(screen.getByTestId('pdf-controls')).toBeInTheDocument()
      expect(screen.getByTestId('pdf-document')).toBeInTheDocument()
    })

    test('applies custom className', () => {
      render(<PDFViewer file={mockFile} className='custom-class' />)

      const viewer = screen.getByTestId('pdf-viewer')
      expect(viewer).toHaveClass('pdf-viewer', 'custom-class')
    })
  })

  describe('Controls', () => {
    test('renders navigation controls', async () => {
      render(<PDFViewer file={mockFile} />)

      expect(screen.getByTestId('prev-page-btn')).toBeInTheDocument()
      expect(screen.getByTestId('next-page-btn')).toBeInTheDocument()
      expect(screen.getByTestId('page-info')).toBeInTheDocument()
    })

    test('renders zoom controls', () => {
      render(<PDFViewer file={mockFile} />)

      expect(screen.getByTestId('zoom-out-btn')).toBeInTheDocument()
      expect(screen.getByTestId('zoom-in-btn')).toBeInTheDocument()
      expect(screen.getByTestId('reset-zoom-btn')).toBeInTheDocument()
      expect(screen.getByTestId('zoom-info')).toBeInTheDocument()
    })

    test('displays initial page info', async () => {
      render(<PDFViewer file={mockFile} />)

      // Wait for PDF to load
      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 3')
      })
    })

    test('displays initial zoom info', () => {
      render(<PDFViewer file={mockFile} />)

      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    test('previous button is disabled on first page', async () => {
      render(<PDFViewer file={mockFile} />)

      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 3')
      })

      const prevBtn = screen.getByTestId('prev-page-btn')
      expect(prevBtn).toBeDisabled()
    })

    test('next button works correctly', async () => {
      render(<PDFViewer file={mockFile} />)

      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 3')
      })

      const nextBtn = screen.getByTestId('next-page-btn')
      expect(nextBtn).not.toBeDisabled()

      fireEvent.click(nextBtn)

      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 2 of 3')
      })
    })

    test('previous button works correctly', async () => {
      render(<PDFViewer file={mockFile} />)

      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 3')
      })

      // Go to page 2
      const nextBtn = screen.getByTestId('next-page-btn')
      fireEvent.click(nextBtn)

      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 2 of 3')
      })

      // Go back to page 1
      const prevBtn = screen.getByTestId('prev-page-btn')
      expect(prevBtn).not.toBeDisabled()
      fireEvent.click(prevBtn)

      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 3')
      })
    })

    test('next button is disabled on last page', async () => {
      render(<PDFViewer file={mockFile} />)

      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 3')
      })

      const nextBtn = screen.getByTestId('next-page-btn')

      // Navigate to last page
      fireEvent.click(nextBtn) // Page 2
      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 2 of 3')
      })

      fireEvent.click(nextBtn) // Page 3
      await waitFor(() => {
        expect(screen.getByTestId('page-info')).toHaveTextContent('Page 3 of 3')
      })

      expect(nextBtn).toBeDisabled()
    })
  })

  describe('Zoom functionality', () => {
    test('zoom in increases scale', async () => {
      render(<PDFViewer file={mockFile} />)

      const zoomInBtn = screen.getByTestId('zoom-in-btn')

      expect(screen.getByText('100%')).toBeInTheDocument()

      fireEvent.click(zoomInBtn)

      expect(screen.getByText('120%')).toBeInTheDocument()
    })

    test('zoom out decreases scale', async () => {
      render(<PDFViewer file={mockFile} />)

      const zoomOutBtn = screen.getByTestId('zoom-out-btn')

      expect(screen.getByText('100%')).toBeInTheDocument()

      fireEvent.click(zoomOutBtn)

      expect(screen.getByText('80%')).toBeInTheDocument()
    })

    test('reset zoom returns to 100%', async () => {
      render(<PDFViewer file={mockFile} />)

      const zoomInBtn = screen.getByTestId('zoom-in-btn')
      const resetZoomBtn = screen.getByTestId('reset-zoom-btn')

      // Zoom in first
      fireEvent.click(zoomInBtn)
      expect(screen.getByText('120%')).toBeInTheDocument()

      // Reset zoom
      fireEvent.click(resetZoomBtn)
      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    test('zoom has minimum limit', async () => {
      render(<PDFViewer file={mockFile} />)

      const zoomOutBtn = screen.getByTestId('zoom-out-btn')

      // Zoom out multiple times to reach minimum
      for (let i = 0; i < 10; i++) {
        fireEvent.click(zoomOutBtn)
      }

      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    test('zoom has maximum limit', async () => {
      render(<PDFViewer file={mockFile} />)

      const zoomInBtn = screen.getByTestId('zoom-in-btn')

      // Zoom in multiple times to reach maximum
      for (let i = 0; i < 15; i++) {
        fireEvent.click(zoomInBtn)
      }

      expect(screen.getByText('300%')).toBeInTheDocument()
    })
  })

  describe('Callbacks', () => {
    test('calls onLoadSuccess when PDF loads', async () => {
      render(<PDFViewer file={mockFile} onLoadSuccess={mockOnLoadSuccess} />)

      await waitFor(() => {
        expect(mockOnLoadSuccess).toHaveBeenCalledWith({ numPages: 3 })
      })
    })

    test('calls onLoadError when PDF fails to load', async () => {
      // Mock a failing PDF load
      const OriginalDocument = require('react-pdf').Document
      require('react-pdf').Document = ({ onLoadError }) => {
        setTimeout(() => {
          onLoadError(new Error('Failed to load'))
        }, 100)
        return <div>Loading...</div>
      }

      render(<PDFViewer file={mockFile} onLoadError={mockOnLoadError} />)

      await waitFor(() => {
        expect(mockOnLoadError).toHaveBeenCalledWith(expect.any(Error))
      })

      // Restore original mock
      require('react-pdf').Document = OriginalDocument
    })
  })

  describe('Error handling', () => {
    test('displays error message when PDF fails to load', async () => {
      // Mock a failing PDF load
      const OriginalDocument = require('react-pdf').Document
      require('react-pdf').Document = ({ onLoadError }) => {
        setTimeout(() => {
          onLoadError(new Error('Failed to load'))
        }, 100)
        return <div>Loading...</div>
      }

      render(<PDFViewer file={mockFile} />)

      await waitFor(() => {
        expect(screen.getByTestId('pdf-error')).toBeInTheDocument()
        expect(screen.getByText('Error: Failed to load')).toBeInTheDocument()
      })

      // Restore original mock
      require('react-pdf').Document = OriginalDocument
    })

    test('handles error without message', async () => {
      const OriginalDocument = require('react-pdf').Document
      require('react-pdf').Document = ({ onLoadError }) => {
        setTimeout(() => {
          onLoadError({})
        }, 100)
        return <div>Loading...</div>
      }

      render(<PDFViewer file={mockFile} />)

      await waitFor(() => {
        expect(screen.getByTestId('pdf-error')).toBeInTheDocument()
        expect(screen.getByText('Error: Failed to load PDF')).toBeInTheDocument()
      })

      // Restore original mock
      require('react-pdf').Document = OriginalDocument
    })
  })

  describe('Accessibility', () => {
    test('navigation buttons have proper aria labels', () => {
      render(<PDFViewer file={mockFile} />)

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    })

    test('zoom buttons have proper aria labels', () => {
      render(<PDFViewer file={mockFile} />)

      expect(screen.getByLabelText('Zoom out')).toBeInTheDocument()
      expect(screen.getByLabelText('Zoom in')).toBeInTheDocument()
      expect(screen.getByLabelText('Reset zoom')).toBeInTheDocument()
    })

    test('has proper test ids for testing', () => {
      render(<PDFViewer file={mockFile} />)

      expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument()
      expect(screen.getByTestId('pdf-controls')).toBeInTheDocument()
      expect(screen.getByTestId('pdf-document')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    test('handles null file gracefully', () => {
      render(<PDFViewer file={null} />)

      expect(screen.getByTestId('pdf-viewer-no-file')).toBeInTheDocument()
    })

    test('handles undefined file gracefully', () => {
      render(<PDFViewer file={undefined} />)

      expect(screen.getByTestId('pdf-viewer-no-file')).toBeInTheDocument()
    })

    test('handles empty string file gracefully', () => {
      render(<PDFViewer file='' />)

      expect(screen.getByTestId('pdf-viewer-no-file')).toBeInTheDocument()
    })
  })
})
