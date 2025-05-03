import React, { useState } from 'react'
import './App.css'

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
      
      const response = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAnalysis(data.analysis)
        setExtractedText(data.extractedText)
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>Scribly - AI Resume Feedback</h1>
      
      <div className="upload-section">
        <input 
          type="file" 
          accept=".pdf,.docx" 
          onChange={handleFileChange}
        />
        {file && <p>Selected file: {file.name}</p>}
        
        <button 
          onClick={handleUpload} 
          disabled={!file || loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {error && (
        <div className="error" style={{color: 'red'}}>
          Error: {error}
        </div>
      )}

      {extractedText && (
        <div className="extracted-text">
          <h3>Extracted Text Preview:</h3>
          <pre style={{whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '10px'}}>
            {extractedText}
          </pre>
        </div>
      )}

      {analysis && (
        <div className="analysis-results">
          <h2>Analysis Results:</h2>
          <pre style={{whiteSpace: 'pre-wrap'}}>{analysis}</pre>
        </div>
      )}
    </div>
  )
}

export default App