import React, { useState } from 'react'
import './App.css'
import './PDFViewer.css'
import PDFViewer from './PDFViewer'
import axios from 'axios'

function App() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [extractedText, setExtractedText] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or DOCX file')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
      setAnalysis(null)
      setExtractedText(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Using axios for better error handling and progress monitoring
      const response = await axios.post('http://localhost:5000/api/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.success) {
        setAnalysis(response.data.analysis)
        setExtractedText(response.data.extractedText)
      } else {
        setError(response.data.error || 'An error occurred during analysis')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(
        error.response?.data?.error || 
        'Failed to analyze resume. Please check if the server is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Determine if we can show the PDF preview
  const canShowPdf = file && file.type === 'application/pdf'

  return (
    <div className="App">
      <header>
        <h1>Scribly - AI Resume Feedback</h1>
      </header>
      
      <div className="upload-section">
        <input 
          type="file" 
          accept=".pdf,.docx" 
          onChange={handleFileChange}
          className="file-input"
        />
        {file && <p className="selected-file">Selected file: {file.name}</p>}
        
        <button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="analyze-button"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {file && analysis && (
        <div className="results-container">
          <div className="pdf-section">
            {canShowPdf ? (
              <PDFViewer file={file} />
            ) : (
              <div className="docx-preview">
                <h3>DOCX Preview</h3>
                <p>DOCX preview is not available. View the extracted text below.</p>
              </div>
            )}
          </div>
          
          <div className="analysis-section">
            <h2>Analysis Results</h2>
            <div className="analysis-content">
              <pre>{analysis}</pre>
            </div>
            
            <div className="extracted-text">
              <h3>Extracted Text Preview</h3>
              <pre>{extractedText}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App