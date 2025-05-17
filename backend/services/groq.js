// services/groq.js - Groq API integration

import dotenv from "dotenv";
import axios from "axios";

// Force reload environment variables
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
}

// Comprehensive logging
console.log('=== DEBUG INFO ===');
console.log('Node Environment:', process.env.NODE_ENV);
console.log('Working Directory:', process.cwd());
console.log('API Key exists:', !!process.env.GROQ_API_KEY);
console.log('API Key length:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0);

// Get API key from environment
const apiKey = process.env.GROQ_API_KEY;

// Base URL for Groq API
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const analyzeResume = async (resumeText) => {
  try {
    if (!apiKey) {
      throw new Error('Groq API key not initialized');
    }

    console.log('\n=== STARTING ANALYSIS ===');
    console.log('Using Groq API for tech-focused resume analysis');

    const prompt = `
You are a technical resume reviewer with experience hiring for cybersecurity and software engineering roles.

In addition to structured feedback, include personal commentary like a mentor or senior engineer would give. Explain why certain things matter, and give examples where helpful. Be specific and avoid generic phrases. Write in a tone that is helpful, honest, and detailed — like a career advisor who wants the candidate to succeed.

Encourage improvement by highlighting both strengths and weaknesses. If something is done well, explain why it’s effective. If something is weak, explain exactly how to fix it with examples or rephrasing. Don’t be afraid to include long-form commentary.

Analyze the resume below and provide markdown-formatted feedback using this structure:

**Overall Assessment:**  
Summarize the resume’s strengths and weaknesses in 2–3 sentences. Include a score from 0 to 100.

**Key Strengths:**  
List the resume’s biggest strengths, grouped by category (e.g., Technical Skills, Projects, Education). Explain why these matter in tech hiring.

**Areas for Improvement:**  
Point out specific weaknesses or gaps. Include both structural and content-related concerns.

**Specific Suggestions for Enhancement:**  
Provide 3–5 detailed tips. Where possible, rewrite a weak line or suggest how to present achievements better.

**Section-by-Section Analysis:**  
Review each section (Objective, Education, Skills, Projects, Experience). Offer honest critique and personalized commentary.

**Tech Hiring Focus:**  
This resume is intended for roles in software engineering, cybersecurity, or IT. Evaluate it like a recruiter screening candidates. Consider relevance, depth, clarity, and practical skills.

**ATS Optimization:**  
Check for common keywords used in applicant tracking systems (e.g., Python, Linux, SOC, SIEM, AWS, React, APIs, vulnerability scanning, project-based experience). Suggest important terms that may be missing.

Resume Text:
${resumeText}
`;

    const requestData = {
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are an expert tech resume reviewer. Return feedback that is practical, detailed, and actionable."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5, // Lower temperature for more consistent, structured output
      max_tokens: 4000
    };

    console.log('Sending request to Groq...');

    const response = await axios.post(GROQ_API_URL, requestData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response received successfully');

    const responseText = response.data.choices[0].message.content;
    return responseText;

  } catch (error) {
    console.error('\n=== GROQ API ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    console.error('Error stack:', error.stack);

    if (error.message.includes('API key')) {
      console.error('\nPOSSIBLE SOLUTIONS:');
      console.error('1. Verify your API key is correct');
      console.error('2. Check if the API key has proper permissions');
      console.error('3. Ensure you\'re using a valid Groq API key');
    }

    throw error;
  }
};


// Test function to check connectivity
export const testGroqConnection = async () => {
  try {
    console.log('\n=== TESTING GROQ CONNECTION ===');
    
    const requestData = {
      model: "llama3-70b-8192",
      messages: [
        { role: "user", content: "Hello" }
      ],
      max_tokens: 10
    };
    
    const response = await axios.post(GROQ_API_URL, requestData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Connection test successful. Response:', response.data.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
};