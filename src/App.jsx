import { useState } from 'react'

import './App.css'
import reactLogo from './assets/react.svg'
import PDFViewer from './components/PDFViewer'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  const [pdfFile, setPdfFile] = useState('/sample.pdf') // Default sample PDF

  const handleFileChange = event => {
    const [file] = event.target.files
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    }
  }

  const handlePdfLoadSuccess = ({ numPages }) => {
    // eslint-disable-next-line no-console
    console.log('PDF loaded successfully with', numPages, 'pages')
  }

  const handlePdfLoadError = error => {
    // eslint-disable-next-line no-console
    console.error('Failed to load PDF:', error)
  }

  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank' rel='noreferrer'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React + PDF Viewer</h1>

      <div className='card'>
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <div className='pdf-section'>
        <h2>PDF Viewer Demo</h2>
        <div className='file-input-container'>
          <label htmlFor='pdf-upload'>Upload a PDF file:</label>
          <input
            type='file'
            id='pdf-upload'
            accept='application/pdf'
            onChange={handleFileChange}
            style={{ margin: '10px 0' }}
          />
        </div>

        <PDFViewer
          file={pdfFile}
          onLoadSuccess={handlePdfLoadSuccess}
          onLoadError={handlePdfLoadError}
        />
      </div>

      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more. Upload a PDF to test the viewer component.
      </p>
    </>
  )
}

export default App
