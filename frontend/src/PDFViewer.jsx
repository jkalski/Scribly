import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import AnnotationContainer from './AnnotationContainer';

// Set up the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Sample annotations - this would come from AI analysis in the real implementation
const sampleAnnotations = [
  {
    id: 1,
    page: 1,
    position: { x: 10, y: 20, width: 30, height: 5 },
    comment: "Consider using the STAR method (Situation, Task, Action, Result) for this bullet point to make it more impactful.",
    color: "#FFEB3B" // Yellow
  },
  {
    id: 2,
    page: 1,
    position: { x: 15, y: 40, width: 40, height: 5 },
    comment: "Add quantifiable achievements here. How much did you improve? What metrics can you include?",
    color: "#4CAF50" // Green
  },
  {
    id: 3,
    page: 1,
    position: { x: 20, y: 60, width: 35, height: 5 },
    comment: "This skill section could be better organized into categories (Programming Languages, Tools, Frameworks, etc.)",
    color: "#2196F3" // Blue
  }
];

const PDFViewer = ({ file, annotations = sampleAnnotations }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const containerRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
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
          disabled={pageNumber <= 1}
          className="pdf-control-btn"
        >
          Previous
        </button>
        <span className="page-info">
          Page {pageNumber} of {numPages}
        </span>
        <button 
          onClick={nextPage} 
          disabled={pageNumber >= numPages}
          className="pdf-control-btn"
        >
          Next
        </button>
        <button onClick={zoomOut} className="pdf-control-btn">
          Zoom -
        </button>
        <button onClick={zoomIn} className="pdf-control-btn">
          Zoom +
        </button>
      </div>

      <div className="pdf-container" ref={containerRef}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="pdf-document"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
          <AnnotationContainer 
            annotations={annotations} 
            pageNumber={pageNumber} 
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;