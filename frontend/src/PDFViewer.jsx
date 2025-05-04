import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PDFViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insight, setInsight] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const options = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@4.8.69/cmaps/',
    cMapPacked: true,
  }), []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (err) => {
    console.error('Error loading PDF:', err);
    setError('Failed to load PDF. Please check if the file is valid.');
    setLoading(false);
  };

  const changePage = (offset) => setPageNumber((prev) => prev + offset);
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.8));

  const handleAnalyzeResume = async () => {
    if (!(file instanceof File)) return;
    const formData = new FormData();
    formData.append('resume', file);

    try {
      setAnalyzing(true);
      const res = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setInsight(data.insight || 'No insight received.');
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setInsight('Error analyzing resume.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <button onClick={() => changePage(-1)} disabled={pageNumber <= 1 || loading}>
          Previous
        </button>
        <span>
          {loading ? 'Loading...' : `Page ${pageNumber} of ${numPages}`}
        </span>
        <button onClick={() => changePage(1)} disabled={pageNumber >= numPages || loading}>
          Next
        </button>
        <button onClick={zoomOut} disabled={loading}>Zoom -</button>
        <button onClick={zoomIn} disabled={loading}>Zoom +</button>
      </div>

      <div className="pdf-container">
        {error ? (
          <div className="pdf-error">{error}</div>
        ) : (
          <Document
            file={file} // ✅ Pass the raw file
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div>Loading PDF...</div>}
            options={options} // ✅ Memoized
          >
            {!loading && (
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            )}
          </Document>
        )}
      </div>

      {file instanceof File && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleAnalyzeResume} disabled={analyzing}>
            {analyzing ? 'Analyzing...' : 'Get Resume Insight'}
          </button>

          {insight && (
            <div style={{ marginTop: '0.5rem' }}>
              <h3>AI Insight</h3>
              <p>{insight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
