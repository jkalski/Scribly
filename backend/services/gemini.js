// services/gemini.js - Updated model name and version

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Force reload environment variables
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
}

// Comprehensive logging
console.log('=== DEBUG INFO ===');
console.log('Node Environment:', process.env.NODE_ENV);
console.log('Working Directory:', process.cwd());
console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
console.log('API Key length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);

// Get API key from environment
const apiKey = process.env.GEMINI_API_KEY;

// Initialize the Gemini API client
let genAI = null;
try {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('\n=== GEMINI INITIALIZATION ===');
  console.log('GoogleGenerativeAI initialized successfully');
} catch (error) {
  console.log('\n=== GEMINI INITIALIZATION FAILED ===');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}

export const analyzeResume = async (resumeText) => {
  try {
    if (!genAI) {
      throw new Error('GoogleGenerativeAI not initialized');
    }

    console.log('\n=== STARTING ANALYSIS ===');
    // Use a valid model name (gemini-1.5-pro is the current model as of May 2025)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    console.log('Model retrieved successfully');
    
    const prompt = `You are an expert resume reviewer. Analyze this resume and provide constructive feedback:

Resume Content:
${resumeText}

Please provide:
1. Overall assessment (score out of 100)
2. Key strengths (list 3-5)
3. Areas for improvement (list 3-5)
4. Specific suggestions for enhancement
5. Section-by-section analysis (Experience, Education, Skills, etc.)

Format your response in a clear, structured manner.`;

    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('Response received successfully');
    
    return response.text();
  } catch (error) {
    console.error('\n=== GEMINI API ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    console.error('Error stack:', error.stack);
    
    // Check for specific error types
    if (error.message.includes('API key')) {
      console.error('\nPOSSIBLE SOLUTIONS:');
      console.error('1. Verify your API key is correct');
      console.error('2. Check if the API key has proper permissions');
      console.error('3. Ensure you\'re using a Google AI Studio API key');
    }
    
    throw error;
  }
};

// Test function to check connectivity
export const testGeminiConnection = async () => {
  try {
    console.log('\n=== TESTING GEMINI CONNECTION ===');
    // Use the updated model name here too
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log('Connection test successful. Response:', response.text());
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return false;
  }
};