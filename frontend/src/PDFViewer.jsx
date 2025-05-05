import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker source for PDF.js - using the local file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PDFViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Options for PDF.js
  const options = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@4.8.69/cmaps/',
    cMapPacked: true,
  }), []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err) => {
    console.error('Error loading PDF:', err);
    setError('Failed to load PDF. Please check if the file is valid.');
    setLoading(false);
  };

  // Page navigation
  const previousPage = () => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setPageNumber(prevPage => Math.min(prevPage + 1, numPages || 1));
  };

  // Zoom controls
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.8));
  };

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
          disabled={pageNumber >= numPages || loading}
          className="pdf-control-btn"
        >
          Next
        </button>
        <button 
          onClick={zoomOut} 
          disabled={loading}
          className="pdf-control-btn"
        >
          Zoom -
        </button>
        <button 
          onClick={zoomIn} 
          disabled={loading}
          className="pdf-control-btn"
        >
          Zoom +
        </button>
      </div>

      <div className="pdf-container">
        {error ? (
          <div className="pdf-error">{error}</div>
        ) : (
          <div style={{ position: 'relative' }}>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div>Loading PDF...</div>}
              options={options}
            >
              {!loading && (
                <div style={{ position: 'relative' }}>
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </div>
              )}
            </Document>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;