// test-gemini.js - Minimal test for Gemini API
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

console.log('Starting Gemini test...');
console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');

try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('GoogleGenerativeAI initialized successfully');
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log('Model retrieved successfully');
  
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
}