import React, { useState } from 'react';
import './App.css';
import './Analysis.css'; // Import our new analysis styles
import PDFViewer from './PDFViewer';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, 
         XCircle, AlertTriangle, Info } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'annotations', 'detailed'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or DOCX file');
        setFile(null);
        setUploadSuccess(false);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setAnalysis(null);
      setExtractedText(null);
      setUploadSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
        setExtractedText(data.extractedText);
      } else {
        setError(data.error || 'An error occurred during analysis');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze resume. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Improved parsing to handle formatting and category titles
  const parseAnalysisText = (text) => {
    if (!text) return {
      strengths: [],
      improvements: [],
      score: 0,
      categories: {}
    };
    
    // Extract overall score
    const scoreMatch = text.match(/Overall [aA]ssessment:?\s*(\d+)\/100/);
    const score = scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1]) : 0;
    
    // Extract strengths with better category handling
    const strengthsMatch = text.match(/Key [sS]trengths:?([\s\S]*?)(?=Areas for [iI]mprovement:|Specific [sS]uggestions:|$)/);
    const strengths = [];
    
    if (strengthsMatch && strengthsMatch[1]) {
      // Look for category patterns like **Category**
      const strengthsText = strengthsMatch[1];
      const categoryItems = {};
      
      // Extract items with their categories
      const categories = strengthsText.match(/\*\*([^*]+)\*\*:([^*]+)(?=\*\*|$)/g);
      
      if (categories && categories.length > 0) {
        categories.forEach(category => {
          const match = category.match(/\*\*([^*]+)\*\*:(.+)/);
          if (match) {
            const categoryName = match[1].trim();
            const content = match[2].trim();
            
            if (!categoryItems[categoryName]) {
              categoryItems[categoryName] = [];
            }
            
            categoryItems[categoryName].push(content);
          }
        });
      } else {
        // Fall back to regular list items if no categories
        const items = strengthsText.split(/\d+\./)
          .filter(item => item.trim().length > 0)
          .map(item => item.trim());
        
        items.forEach(item => {
          strengths.push({
            category: null,
            content: item
          });
        });
      }
      
      // Convert the category items into the format we need
      Object.keys(categoryItems).forEach(category => {
        categoryItems[category].forEach(content => {
          strengths.push({
            category,
            content
          });
        });
      });
    }
    
    // Extract improvements with better category handling
    const improvementsMatch = text.match(/Areas for [iI]mprovement:?([\s\S]*?)(?=Specific [sS]uggestions:|Section-by-section|$)/);
    const improvements = [];
    
    if (improvementsMatch && improvementsMatch[1]) {
      // Look for category patterns like **Category**
      const improvementsText = improvementsMatch[1];
      const categoryItems = {};
      
      // Extract items with their categories
      const categories = improvementsText.match(/\*\*([^*]+)\*\*:([^*]+)(?=\*\*|$)/g);
      
      if (categories && categories.length > 0) {
        categories.forEach(category => {
          const match = category.match(/\*\*([^*]+)\*\*:(.+)/);
          if (match) {
            const categoryName = match[1].trim();
            const content = match[2].trim();
            
            if (!categoryItems[categoryName]) {
              categoryItems[categoryName] = [];
            }
            
            categoryItems[categoryName].push(content);
          }
        });
      } else {
        // Fall back to regular list items if no categories
        const items = improvementsText.split(/\d+\./)
          .filter(item => item.trim().length > 0)
          .map(item => item.trim());
        
        items.forEach(item => {
          improvements.push({
            category: null,
            content: item
          });
        });
      }
      
      // Convert the category items into the format we need
      Object.keys(categoryItems).forEach(category => {
        categoryItems[category].forEach(content => {
          improvements.push({
            category,
            content
          });
        });
      });
    }
    
    return {
      strengths,
      improvements,
      score
    };
  };
  
  const analysisData = parseAnalysisText(analysis);
  
  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  // Determine if we can show the PDF preview
  const canShowPdf = file && file.type === 'application/pdf';

  return (
    <div className="App">
      {/* Modern Full-Width Header */}
      <div className="main-header">
        <img src="/ScriblyLogo.png" alt="Scribly Logo" className="header-logo" />
        <nav className="header-nav">
          <a href="#" className="header-link">Home</a>
          <a href="#" className="header-link">About</a>
          <a href="#" className="header-link">Contact</a>
        </nav>
      </div>
      
      <header>
        <h1>Scribly - AI Resume Feedback</h1>
        <p className="subtitle">Upload your resume for AI-powered feedback and improvement suggestions</p>
      </header>
      
      <div className="upload-section">
        <div className="upload-container">
          <label htmlFor="file-upload" className="file-upload-label">
            <Upload size={24} />
            <span>Choose a file</span>
            <input 
              id="file-upload"
              type="file" 
              accept=".pdf,.docx" 
              onChange={handleFileChange}
              className="file-input"
            />
          </label>
          {file && <p className="selected-file"><FileText size={16} /> {file.name}</p>}
          
          {uploadSuccess && (
            <div className="success-message">
              <CheckCircle size={16} />
              File uploaded successfully
            </div>
          )}
        </div>
        
        <button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="analyze-button"
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </div>

      {error && (
        <div className="error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {file && analysis && (
        <div className="results-container">
          <div className="pdf-section">
            <h2>Document Preview</h2>
            {canShowPdf ? (
              <PDFViewer file={file} />
            ) : (
              <div className="docx-preview">
                <h3>DOCX Preview</h3>
                <p>DOCX preview is not available. View the extracted text below.</p>
                <div className="extracted-text-preview p-4 bg-gray-100 mt-4 rounded text-left">
                  <pre className="text-sm whitespace-pre-wrap">{extractedText}</pre>
                </div>
              </div>
            )}
          </div>
          
          <div className="analysis-section">
            <div className="analysis-header">
              <h2>Analysis Results</h2>
            </div>
            
            {/* Score Card */}
            <div className={`score-card ${getScoreColor(analysisData.score)}`}>
              <div className="score-label">Resume Score</div>
              <div className="score-value">{analysisData.score}/100</div>
            </div>
            
            <div className="tab-container">
              <button 
                className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Summary
              </button>
              <button 
                className={`tab-button ${activeTab === 'detailed' ? 'active' : ''}`}
                onClick={() => setActiveTab('detailed')}
              >
                Detailed Analysis
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'summary' && (
                <div className="summary-view">
                  {/* Strengths Section */}
                  <div className="mb-6">
                    <h3 className="section-title">
                      <CheckCircle size={18} className="text-green-500" />
                      Key Strengths
                    </h3>
                    <ul className="analysis-list">
                      {analysisData.strengths.map((item, index) => (
                        <li key={index} className="analysis-item">
                          {item.category && (
                            <span className="category-title">{item.category}</span>
                          )}
                          <div className="flex">
                            <span className="analysis-item-icon text-green-500">•</span>
                            <span>{item.content}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Improvements Section */}
                  <div className="mb-6">
                    <h3 className="section-title">
                      <XCircle size={18} className="text-red-500" />
                      Areas for Improvement
                    </h3>
                    <ul className="analysis-list">
                      {analysisData.improvements.map((item, index) => (
                        <li key={index} className="analysis-item">
                          {item.category && (
                            <span className="category-title">{item.category}</span>
                          )}
                          <div className="flex">
                            <span className="analysis-item-icon text-red-500">•</span>
                            <span>{item.content}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'detailed' && (
                <div className="detailed-analysis">
                  <h3 className="section-title mb-3">Complete Analysis</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 text-left">
                    <div className="whitespace-pre-line">{analysis}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;