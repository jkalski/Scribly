import React, { useState, useEffect } from "react";
import "./App.css";
import "./Analysis.css";
import PDFViewer from "./PDFViewer";
import ReactMarkdown from "react-markdown";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader,
  XCircle,
} from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or DOCX file");
        setFile(null);
        setUploadSuccess(false);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setAnalysis(null);
      setExtractedText(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:5000/api/analyze-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
        setExtractedText(data.extractedText);
      } else {
        setError(data.error || "An error occurred during analysis");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "Failed to analyze resume. Please check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const parseAnalysisText = (text) => {
    if (!text)
      return { strengths: [], improvements: [], score: 0, categories: {} };
    const scoreMatch = text.match(/Overall [aA]ssessment:.*?(\d+)\/?100/);
    const score = scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1]) : 0;
    const parseItems = (pattern) => {
      const match = text.match(pattern);
      const items = [];
      if (match && match[1]) {
        const raw = match[1];
        const bullets = raw
          .split(/[-•*]+\s+/)
          .filter((s) => s.trim().length > 0);
        bullets.forEach((content) =>
          items.push({ content: content.replace(/\*\*/g, "").trim() })
        );
      }
      return items;
    };
    const strengths = parseItems(
      /Key [sS]trengths:?([\s\S]*?)(Areas for [iI]mprovement:|$)/
    );
    const improvements = parseItems(
      /Areas for [iI]mprovement:?([\s\S]*?)(Specific [sS]uggestions:|$)/
    );
    return { strengths, improvements, score };
  };

  const analysisData = parseAnalysisText(analysis);
  const canShowPdf = file && file.type === "application/pdf";

  return (
    <>
      <header className="site-header">
        <div className="logo">
          <img src="/ScriblyLogo.png" alt="Scribly Logo" className="logo-img" />
          <span className="logo-text">Scribly</span>
        </div>
        <nav className="header-nav">
          <a href="#" className="header-link">Home</a>
          <a href="#about" className="header-link">About</a>
          <a href="#contact" className="header-link">Contact</a>
        </nav>
      </header>

      <section style={{ background: '#4c74c9', color: 'white', padding: '6rem 2rem 4rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>AI Resume Feedback</h1>
            <p style={{ fontSize: '1.25rem', maxWidth: '700px' }}>
              Upload your resume to receive instant, AI-powered feedback tailored for tech careers.
              Scribly helps you stand out with suggestions for structure, keywords, and content.
            </p>
          </div>
          <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
            <img src="/analyze_pic.png" alt="AI resume analyzer graphic" style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
            }} />
          </div>
        </div>
      </section>

      <div className="App">
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
            {file && (
              <p className="selected-file">
                <FileText size={16} /> {file.name}
              </p>
            )}
            {uploadSuccess && (
              <div className="success-message">
                <CheckCircle size={16} /> File uploaded successfully
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
                <Loader size={18} />
                <span>Analyzing...</span>
              </>
            ) : (
              "Analyze Resume"
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
                  <div className="extracted-text-preview">
                    <pre>{extractedText}</pre>
                  </div>
                </div>
              )}
            </div>

            <div className="analysis-section">
              <div className="analysis-header">
                <h2>Analysis Results</h2>
              </div>
              <div
                className={`score-card ${analysisData.score >= 80
                  ? "score-high"
                  : analysisData.score >= 60
                    ? "score-medium"
                    : "score-low"
                  }`}
              >
                <div className="score-label">Resume Score</div>
                <div className="score-value">{analysisData.score}/100</div>
              </div>
              <div className="tab-container">
                <button
                  className={`tab-button ${activeTab === "summary" ? "active" : ""}`}
                  onClick={() => setActiveTab("summary")}
                >
                  Summary
                </button>
                <button
                  className={`tab-button ${activeTab === "detailed" ? "active" : ""}`}
                  onClick={() => setActiveTab("detailed")}
                >
                  Detailed Analysis
                </button>
              </div>
              <div className="tab-content">
                {activeTab === "summary" && (
                  <div className="summary-view">
                    <div className="strengths-section">
                      <h3 className="section-title">
                        <CheckCircle size={18} /> Key Strengths
                      </h3>
                      <ul className="analysis-list">
                        {analysisData.strengths.map((item, index) => (
                          <li key={index} className="analysis-item">
                            <div className="item-content">
                              <span className="item-bullet">•</span>
                              <span>{item.content}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="improvements-section">
                      <h3 className="section-title">
                        <XCircle size={18} /> Areas for Improvement
                      </h3>
                      <ul className="analysis-list">
                        {analysisData.improvements.map((item, index) => (
                          <li key={index} className="analysis-item">
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
                {activeTab === "detailed" && (
                  <div className="detailed-analysis">
                    <h3 className="section-title">Complete Analysis</h3>
                    <div className="analysis-text">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#032153', color: 'white', padding: '4rem 2rem 2rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '2rem'
        }}>
          <div style={{ flex: '1 1 300px' }} id="about">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About Scribly</h3>
            <p style={{ lineHeight: '1.6' }}>
              Scribly is an AI-powered resume feedback tool designed for job seekers in tech.
              We help you improve structure, language, and content — instantly and effectively.
            </p>
          </div>
          <div style={{ flex: '1 1 300px' }} id="contact">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Contact Us</h3>
            <p style={{ lineHeight: '1.6' }}>
              Have questions, feedback, or want to collaborate?
              <br />
              Reach out at: <a href="mailto:support@scribly.ai" style={{ color: '#aaccff' }}>support@scribly.ai</a>
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem', color: '#ccc' }}>
          &copy; {new Date().getFullYear()} Scribly. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default App;
