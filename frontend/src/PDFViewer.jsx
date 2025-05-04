import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
// Import pdfjs explicitly to set worker
import * as pdfjs from 'pdfjs-dist';

// Set a specific version that exists on the CDN
// Using a known version that's available on CDN - don't use pdfjs.version
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Log version for debugging
console.log('PDF.js version in code:', pdfjs.version);
console.log('Worker source set to:', pdfjs.GlobalWorkerOptions.workerSrc);

const PDFViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create object URL from file
  const fileUrl = file instanceof File ? URL.createObjectURL(file) : file;

  function onDocumentLoadSuccess({ numPages }) {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF. Please check if the file is valid.");
    setLoading(false);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.5));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.8));
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <button 
          onClick={previousPage} 
          disabled={pageNumber <= 1 || loading}
          className="pdf-control-btn"
        >
          Previous
        </button>
        <span className="page-info">
          {loading ? 'Loading...' : `Page ${pageNumber} of ${numPages}`}
        </span>
        <button 
          onClick={nextPage} 
          disabled={!numPages || pageNumber >= numPages || loading}
          className="pdf-control-btn"
        >
          Next
        </button>
        <button onClick={zoomOut} disabled={loading} className="pdf-control-btn">
          Zoom -
        </button>
        <button onClick={zoomIn} disabled={loading} className="pdf-control-btn">
          Zoom +
        </button>
      </div>

      <div className="pdf-container">
        {error ? (
          <div className="pdf-error">
            {error}
          </div>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="pdf-loading">Loading PDF...</div>}
            options={{
              cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
              cMapPacked: true,
            }}
          >
            {loading ? null : (
              <Page 
                key={`page_${pageNumber}`}
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            )}
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;