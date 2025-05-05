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
    console.log('Using Groq API for analysis');
    
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

    // Preparing the request for Groq API
    const requestData = {
      model: "llama3-70b-8192", // You can also use "mixtral-8x7b-32768" or other available models
      messages: [
        { 
          role: "system", 
          content: "You are an expert resume reviewer who provides detailed, constructive feedback."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
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
    
    // Extract the content from the Groq response
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
    
    // Check for specific error types
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