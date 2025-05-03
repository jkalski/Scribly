// test-gemini.js - Updated model name
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

console.log('Starting Gemini test...');
console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
console.log('API Key (first 5 chars):', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) + '...' : 'N/A');

try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('GoogleGenerativeAI initialized successfully');
  
  // Updated model name to gemini-1.5-pro
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  console.log('Model retrieved successfully');
  
  // Testing with a simple prompt
  console.log('Sending test request...');
  const result = await model.generateContent("Say 'Hello, this is a test'");
  const response = await result.response;
  console.log('Success! Response:', response.text());
} catch (error) {
  console.error('\nError Details:');
  console.error('Name:', error.name);
  console.error('Message:', error.message);
  console.error('Code:', error.code);
  console.error('Status:', error.status);
  if (error.response) {
    console.error('Response:', error.response);
  }
  console.error('Stack:', error.stack);
  
  // Provide more helpful information about common errors
  if (error.message.includes('not found')) {
    console.error('\n--- TROUBLESHOOTING SUGGESTIONS ---');
    console.error('1. The model name may be incorrect. Current valid models include:');
    console.error('   - gemini-1.5-pro');
    console.error('   - gemini-1.5-flash');
    console.error('2. Your API key may not have access to this model');
    console.error('3. Check for version compatibility between your API and the model');
  }
}