import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import PdfReader from "pdfreader";
import mammoth from "mammoth";
import { analyzeResume } from "./services/gemini.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Function to extract text from PDF using pdfreader
const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    let text = [];
    let rows = {};
    
    new PdfReader.PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item) {
        // Sort rows by y position and join text
        Object.keys(rows)
          .sort((y1, y2) => parseFloat(y1) - parseFloat(y2))
          .forEach(y => text.push((rows[y] || []).join('')));
        resolve(text.join('\n'));
      }
      else if (item.text) {
        // Accumulate text items into rows
        (rows[item.y] = rows[item.y] || []).push(item.text);
      }
    });
  });
};

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.post("/api/analyze-resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: "No file uploaded" 
      });
    }

    let resumeText = "";
    
    if (req.file.mimetype === 'application/pdf') {
      // Parse PDF
      resumeText = await extractTextFromPDF(req.file.buffer);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      resumeText = result.value;
    } else {
      return res.status(400).json({ 
        success: false,
        error: "Unsupported file type. Please upload PDF or DOCX." 
      });
    }

    // Check if we extracted any text
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "Could not extract text from the file" 
      });
    }

    console.log(`Extracted text preview: ${resumeText.substring(0, 100)}...`);
    
    const analysis = await analyzeResume(resumeText);
    
    res.json({ 
      success: true,
      analysis: analysis,
      extractedText: resumeText.substring(0, 500) // Include first 500 chars for debugging
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to analyze resume: " + error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
});