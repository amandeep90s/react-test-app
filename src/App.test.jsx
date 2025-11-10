import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom'

import App from './App'

// Mock the PDFViewer component
jest.mock('./components/PDFViewer', () => {
  const MockPDFViewer = ({ file, onLoadSuccess, onLoadError, ...props }) => (
    <div data-testid='mock-pdf-viewer' {...props}>
      <div data-testid='pdf-file'>{typeof file === 'string' ? file : file?.name || 'No file'}</div>
      <button
        data-testid='simulate-success'
        onClick={() => onLoadSuccess?.({ numPages: 2 })}
        type='button'
      >
        Simulate Success
      </button>
      <button
        data-testid='simulate-error'
        onClick={() => onLoadError?.(new Error('Test error'))}
        type='button'
      >
        Simulate Error
      </button>
    </div>
  )
  MockPDFViewer.displayName = 'MockPDFViewer'
  return MockPDFViewer
})

// Mock console methods to avoid test noise
const originalConsoleLog = console.log
const originalConsoleError = console.error

beforeAll(() => {
  console.log = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.log = originalConsoleLog
  console.error = originalConsoleError
})

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders main app elements', () => {
    render(<App />)

    expect(screen.getByText('Vite + React + PDF Viewer')).toBeInTheDocument()
    expect(screen.getByText(/count is/)).toBeInTheDocument()
    expect(screen.getByText('PDF Viewer Demo')).toBeInTheDocument()
  })

  it('renders PDF viewer component', () => {
    render(<App />)

    expect(screen.getByTestId('mock-pdf-viewer')).toBeInTheDocument()
  })

  it('counter functionality works', () => {
    render(<App />)

    const button = screen.getByRole('button', { name: /count is/ })
    expect(button).toHaveTextContent('count is 0')

    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 1')

    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 2')
  })

  it('displays default PDF file', () => {
    render(<App />)

    expect(screen.getByTestId('pdf-file')).toHaveTextContent('/sample.pdf')
  })

  it('file upload functionality works', async () => {
    render(<App />)

    const fileInput = screen.getByLabelText('Upload a PDF file:')

    // Create a mock PDF file
    const mockFile = new File(['mock pdf content'], 'test.pdf', { type: 'application/pdf' })

    fireEvent.change(fileInput, { target: { files: [mockFile] } })

    await waitFor(() => {
      expect(screen.getByTestId('pdf-file')).toHaveTextContent('test.pdf')
    })
  })

  it('ignores non-PDF files', async () => {
    render(<App />)

    const fileInput = screen.getByLabelText('Upload a PDF file:')

    // Create a mock non-PDF file
    const mockFile = new File(['mock content'], 'test.txt', { type: 'text/plain' })

    fireEvent.change(fileInput, { target: { files: [mockFile] } })

    // Should still show the default PDF file
    await waitFor(() => {
      expect(screen.getByTestId('pdf-file')).toHaveTextContent('/sample.pdf')
    })
  })

  it('handles successful PDF load', async () => {
    render(<App />)

    const successButton = screen.getByTestId('simulate-success')

    fireEvent.click(successButton)

    // Check that console.log was called with success message
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('PDF loaded successfully with', 2, 'pages')
    })
  })

  it('handles PDF load error', async () => {
    render(<App />)

    const errorButton = screen.getByTestId('simulate-error')

    fireEvent.click(errorButton)

    // Check that console.error was called with error
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to load PDF:', expect.any(Error))
    })
  })

  it('file input accepts PDF files', () => {
    render(<App />)

    const fileInput = screen.getByLabelText('Upload a PDF file:')
    expect(fileInput).toHaveAttribute('accept', 'application/pdf')
    expect(fileInput).toHaveAttribute('type', 'file')
  })

  it('renders logos with correct links', () => {
    render(<App />)

    const viteLink = screen.getByRole('link', { name: /vite logo/i })
    const reactLink = screen.getByRole('link', { name: /react logo/i })

    expect(viteLink).toHaveAttribute('href', 'https://vite.dev')
    expect(reactLink).toHaveAttribute('href', 'https://react.dev')
  })

  it('renders help text', () => {
    render(<App />)

    expect(
      screen.getByText(
        /Click on the Vite and React logos to learn more. Upload a PDF to test the viewer component./
      )
    ).toBeInTheDocument()
  })

  it('PDF section has proper structure', () => {
    render(<App />)

    const pdfSection = screen.getByText('PDF Viewer Demo').closest('div')
    expect(pdfSection).toHaveClass('pdf-section')

    const fileInputContainer = screen.getByLabelText('Upload a PDF file:').closest('div')
    expect(fileInputContainer).toHaveClass('file-input-container')
  })
})
