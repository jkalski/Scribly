// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import './Analysis.css';
import PDFViewer from './PDFViewer';
import ReactMarkdown from 'react-markdown';
import {
  Upload, FileText, AlertCircle, CheckCircle, Loader,
  XCircle
} from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, []);

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

  const parseAnalysisText = (text) => {
    if (!text) return { strengths: [], improvements: [], score: 0 };

    const scoreMatch = text.match(/Overall [aA]ssessment:?[ \t]*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    const parseSection = (regex) => {
      const match = text.match(regex);
      if (!match || !match[1]) return [];

      const sectionText = match[1];
      const categories = sectionText.match(/\*\*([^*]+)\*\*:([^*]+)(?=\*\*|$)/g);
      const items = [];

      if (categories) {
        categories.forEach(cat => {
          const match = cat.match(/\*\*([^*]+)\*\*:(.+)/);
          if (match) {
            items.push({ category: match[1].trim(), content: match[2].trim() });
          }
        });
      } else {
        sectionText
          .split(/\d+\./)
          .filter(i => i.trim())
          .forEach(content => items.push({ category: null, content: content.trim() }));
      }

      return items;
    };

    return {
      strengths: parseSection(/Key [sS]trengths:?([\s\S]*?)(?=Areas for [iI]mprovement:|Specific [sS]uggestions:|$)/),
      improvements: parseSection(/Areas for [iI]mprovement:?([\s\S]*?)(?=Specific [sS]uggestions:|Section-by-section|$)/),
      score
    };
  };

  const analysisData = parseAnalysisText(analysis);
  const getScoreColor = (score) => score >= 80 ? 'score-high' : score >= 60 ? 'score-medium' : 'score-low';
  const canShowPdf = file && file.type === 'application/pdf';

  return (
    <div className="App">
      <header className="site-header">
        <div className="logo">
          <img src="/ScriblyLogo.png" alt="Scribly Logo" className="logo-img" />
          <span className="logo-text">Scribly</span>
        </div>
        <nav className="header-nav">
          <a href="#about" className="header-link">About</a>
          <a href="#contact" className="header-link">Contact</a>
        </nav>
      </header>

      <section className="page-intro">
        <h1>AI Resume Feedback</h1>
        <p>Upload your resume for AI-powered feedback and improvement suggestions</p>
      </section>

      <div className="upload-section">
        <div className="upload-container">
          <label htmlFor="file-upload" className="file-upload-label">
            <Upload size={24} />
            <span>Choose a file</span>
            <input id="file-upload" type="file" accept=".pdf,.docx" onChange={handleFileChange} className="file-input" />
          </label>
          {file && <p className="selected-file"><FileText size={16} /> {file.name}</p>}
          {uploadSuccess && <div className="success-message"><CheckCircle size={16} /> File uploaded successfully</div>}
        </div>

        <button onClick={handleUpload} disabled={!file || loading} className="analyze-button">
          {loading ? (<><Loader size={18} /> <span>Analyzing...</span></>) : 'Analyze Resume'}
        </button>
      </div>

      {error && <div className="error"><AlertCircle size={18} /> {error}</div>}

      {file && analysis && (
        <div className="results-container">
          <div className="pdf-section">
            <h2>Document Preview</h2>
            {canShowPdf ? <PDFViewer file={file} /> : (
              <div className="docx-preview">
                <h3>DOCX Preview</h3>
                <p>DOCX preview is not available. View the extracted text below.</p>
                <div className="extracted-text-preview">
                  <pre>{extractedText}</pre>
                </div>
              </div>
            )}
          </div>

          <div className="analysis-section">
            <h2>Analysis Results</h2>
            <div className={`score-card ${getScoreColor(analysisData.score)}`}>
              <div className="score-label">Resume Score</div>
              <div className="score-value">{analysisData.score}/100</div>
            </div>

            <div className="tab-container">
              <button className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
              <button className={`tab-button ${activeTab === 'detailed' ? 'active' : ''}`} onClick={() => setActiveTab('detailed')}>Detailed Analysis</button>
            </div>

            <div className="tab-content">
              {activeTab === 'summary' && (
                <div className="summary-view">
                  <div className="strengths-section">
                    <h3 className="section-title"><CheckCircle size={18} /> Key Strengths</h3>
                    <ul className="analysis-list">
                      {analysisData.strengths.map((item, index) => (
                        <li key={index} className="analysis-item">
                          {item.category && <span className="category-title">{item.category}</span>}
                          <div className="item-content">
                            <span className="item-bullet">•</span>
                            <span>{item.content}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="improvements-section">
                    <h3 className="section-title"><XCircle size={18} /> Areas for Improvement</h3>
                    <ul className="analysis-list">
                      {analysisData.improvements.map((item, index) => (
                        <li key={index} className="analysis-item">
                          {item.category && <span className="category-title">{item.category}</span>}
                          <div className="item-content">
                            <span className="item-bullet">•</span>
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
                  <h3 className="section-title">Complete Analysis</h3>
                  <div className="analysis-content">
                    <div className="analysis-text">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section id="about" className="info-section">
        <h2>About Scribly</h2>
        <p>
          Scribly is your AI-powered resume analysis tool. Our mission is to help job seekers improve their resumes
          with instant, actionable feedback. Whether you're applying to internships or full-time roles, Scribly gives
          you a competitive edge with data-backed insights.
        </p>
      </section>

      <section id="contact" className="info-section">
        <h2>Contact Us</h2>
        <p>
          Have questions, feedback, or want to collaborate? Reach out to us at
          <a href="mailto:hello@scribly.ai" style={{ color: '#4a86e8', textDecoration: 'none' }}> hello@scribly.ai</a>.
          We're always happy to connect!
        </p>
      </section>
    </div>
  );
}

export default App;
