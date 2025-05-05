// test-groq.js - Test script for Groq API
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

console.log('Starting Groq test...');
console.log('API Key loaded:', process.env.GROQ_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0);
console.log('API Key (first 5 chars):', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 5) + '...' : 'N/A');

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function testGroq() {
  try {
    // Test with a simple prompt
    console.log('Sending test request to Groq API...');
    
    const requestData = {
      model: "llama3-70b-8192", // Or another model like "mixtral-8x7b-32768"
      messages: [
        { role: "user", content: "Say 'Hello, this is a test'" }
      ],
      temperature: 0.7,
      max_tokens: 50
    };
    
    const response = await axios.post(GROQ_API_URL, requestData, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Success! Response data:');
    console.log('Model:', response.data.model);
    console.log('Content:', response.data.choices[0].message.content);
    console.log('Tokens used:', response.data.usage.total_tokens);
    console.log('Response time (ms):', response.data.usage.completion_time_ms);
  } catch (error) {
    console.error('\nError Details:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    
    console.error('Stack:', error.stack);
    
    console.error('\n--- TROUBLESHOOTING SUGGESTIONS ---');
    console.error('1. Verify your API key is correct and active');
    console.error('2. Check available models at: https://console.groq.com/docs/models');
    console.error('3. Make sure your network can reach the Groq API');
  }
}

// Run the test
testGroq();