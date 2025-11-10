# React PDF Viewer Integration

This project demonstrates the integration of `react-pdf` library into a React application with comprehensive test coverage.

## 🚀 Features

### PDF Viewer Component

- **File Support**: Displays PDF files from URLs or File objects
- **Navigation**: Previous/Next page controls with keyboard shortcuts
- **Zoom Controls**: Zoom in, zoom out, and reset zoom functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Visual feedback during PDF loading and page rendering

### Technical Features

- **TypeScript-ready**: Component is written with TypeScript compatibility in mind
- **Comprehensive Testing**: Unit tests with >80% coverage requirement
- **Modern React**: Uses React 19+ with hooks and functional components
- **Styled Components**: Custom CSS with dark mode support
- **Performance Optimized**: Proper code splitting and lazy loading

## 📦 Installation

The project includes the following PDF-related dependencies:

```bash
# Main dependencies
pnpm add react-pdf

# Development dependencies (already included)
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D jest babel-jest @babel/preset-env @babel/preset-react
pnpm add -D jest-transform-stub identity-obj-proxy
```

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` has been configured to properly handle PDF.js workers:

```javascript
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-pdf'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-pdf': ['react-pdf'],
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
})
```

### Jest Configuration

Jest is configured to handle PDF.js and CSS modules:

```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
    // ... path aliases
  },
  transformIgnorePatterns: ['node_modules/(?!(react-pdf)/)'],
  // ... coverage configuration
}
```

## 🎮 Usage

### Basic Usage

```jsx
import PDFViewer from './components/PDFViewer'

function App() {
  const [pdfFile, setPdfFile] = useState('/sample.pdf')

  const handleLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded with', numPages, 'pages')
  }

  return (
    <PDFViewer
      file={pdfFile}
      onLoadSuccess={handleLoadSuccess}
      onLoadError={error => console.error('Failed to load:', error)}
    />
  )
}
```

### File Upload Integration

```jsx
const handleFileChange = event => {
  const [file] = event.target.files
  if (file && file.type === 'application/pdf') {
    setPdfFile(file)
  }
}

return (
  <div>
    <input type='file' accept='application/pdf' onChange={handleFileChange} />
    <PDFViewer file={pdfFile} />
  </div>
)
```

## 📊 Component API

### PDFViewer Props

| Prop            | Type                                   | Default     | Description                        |
| --------------- | -------------------------------------- | ----------- | ---------------------------------- |
| `file`          | `string \| File \| null`               | `null`      | PDF file URL or File object        |
| `className`     | `string`                               | `''`        | Additional CSS classes             |
| `onLoadSuccess` | `(info: { numPages: number }) => void` | `undefined` | Called when PDF loads successfully |
| `onLoadError`   | `(error: Error) => void`               | `undefined` | Called when PDF fails to load      |

### PDFViewer Features

- **Navigation Controls**:
  - Previous/Next page buttons
  - Page counter display
  - Automatic disable of navigation when at boundaries

- **Zoom Controls**:
  - Zoom in (+20% per click, max 300%)
  - Zoom out (-20% per click, min 50%)
  - Reset to 100% zoom
  - Visual zoom percentage display

- **Responsive Design**:
  - Mobile-friendly controls
  - Stacked layout on small screens
  - Touch-friendly button sizes

## 🧪 Testing

The project includes comprehensive test coverage:

### Test Categories

1. **Rendering Tests**
   - Component renders without crashing
   - Proper handling of missing file prop
   - Custom className application

2. **Control Tests**
   - Navigation button functionality
   - Zoom control operations
   - Proper button state management

3. **Navigation Tests**
   - Page navigation logic
   - Button disable/enable states
   - Boundary conditions

4. **Zoom Tests**
   - Zoom in/out functionality
   - Zoom limits (min/max)
   - Reset zoom functionality

5. **Callback Tests**
   - onLoadSuccess callback execution
   - onLoadError callback execution

6. **Error Handling Tests**
   - PDF load error display
   - Graceful fallback states

7. **Accessibility Tests**
   - ARIA label presence
   - Keyboard navigation support
   - Screen reader compatibility

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Test Coverage Requirements

The project maintains >80% coverage across:

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## 🎨 Styling

The PDFViewer component includes comprehensive CSS styling:

### Features

- Clean, modern design
- Dark mode support
- Responsive layout
- Smooth transitions and hover effects
- Accessible color contrast
- Mobile-optimized controls

### CSS Classes

- `.pdf-viewer` - Main container
- `.pdf-controls` - Control bar
- `.pdf-navigation` - Navigation buttons
- `.pdf-zoom` - Zoom controls
- `.pdf-document` - PDF display area
- `.pdf-error` - Error state styling
- `.pdf-loading` - Loading state styling

## 📱 Responsive Design

The component is fully responsive:

- **Desktop**: Full horizontal control layout
- **Tablet**: Maintained horizontal layout with touch-friendly buttons
- **Mobile**: Stacked vertical layout for optimal space usage

## ♿ Accessibility

The component follows accessibility best practices:

- **ARIA Labels**: All buttons have descriptive labels
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Compatible with screen reading software
- **Color Contrast**: Meets WCAG guidelines
- **Focus Management**: Clear focus indicators

## 🚀 Development

### Running the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5174`

### Building for Production

```bash
pnpm build
```

### Linting and Formatting

```bash
# Check for linting issues
pnpm lint:check

# Auto-fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

## 📄 Sample PDF

To test the PDF viewer:

1. Create a sample PDF file and save it as `public/sample.pdf`
2. Or use the file upload feature in the application
3. The component will display the PDF with full controls

### Creating a Sample PDF

You can create a sample PDF by:

1. Opening `public/sample-document.html` in a browser
2. Using Print → Save as PDF
3. Saving the file as `public/sample.pdf`

## 🔧 Troubleshooting

### Common Issues

1. **PDF.js Worker Issues**
   - Ensure Vite configuration includes worker settings
   - Check that CORS headers are properly set

2. **CSS Import Errors**
   - react-pdf CSS files may not be available in all versions
   - The component works without these imports

3. **Test Failures**
   - Ensure Jest configuration includes proper transforms
   - Check that all mock dependencies are correctly set up

## 📚 Dependencies

### Production Dependencies

- `react`: ^19.1.1
- `react-dom`: ^19.1.1
- `react-pdf`: ^10.2.0

### Development Dependencies

- `@testing-library/react`: ^16.3.0
- `@testing-library/jest-dom`: ^6.9.1
- `jest`: ^30.2.0
- `babel-jest`: ^30.2.0
- And more...

## 🤝 Contributing

1. Ensure all tests pass: `pnpm test`
2. Maintain code coverage above 80%
3. Follow the existing code style
4. Add tests for new features
5. Update documentation as needed

## 📝 License

This project is part of the tutorial series and is available under the MIT License.
