import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import './PDFViewer.css';

const PDFViewer = ({ file }) => {
  const [fileUrl, setFileUrl] = useState(null);

  // Plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0]],
  });

  const plugins = [
    defaultLayoutPluginInstance,
    zoomPlugin(),
    thumbnailPlugin(),
  ];

  // Manage blob URL lifecycle
  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFileUrl(url);
    console.log('Blob URL created:', url);

    return () => {
      URL.revokeObjectURL(url);
      console.log('Blob URL revoked:', url);
    };
  }, [file]);

  return (
    <div className="pdf-viewer-container">
      {fileUrl ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={plugins}
            defaultScale={1.0}
            theme={{ theme: 'light' }}
            onDocumentLoad={() => console.log('PDF document loaded')}
            onDocumentLoadError={(error) => console.error('PDF load error:', error)}
          />
        </Worker>
      ) : (
        <div className="no-pdf-message">
          <p>No PDF document selected</p>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
