// check-env.js - Verify your environment setup

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

console.log('=== ENVIRONMENT CHECK ===\n');

// Check if .env file exists
const envPath = path.resolve(process.cwd(), '.env');
console.log('1. .env file location:', envPath);
console.log('   Exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('   Content preview:');
  envContent.split('\n').forEach((line, index) => {
    if (line.includes('API_KEY')) {
      console.log(`   Line ${index + 1}: ${line.substring(0, 20)}...`);
    }
  });
}

// Load environment variables
console.log('\n2. Loading Environment Variables:');
const result = dotenv.config();
console.log('   Load result:', result.error ? 'Error' : 'Success');
if (result.error) {
  console.log('   Error details:', result.error.message);
}

// Check package.json for module type
console.log('\n3. Package Configuration:');
const packagePath = path.resolve(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('   Module type:', packageJson.type || 'commonjs (default)');
  console.log('   Dependencies:', packageJson.dependencies ? Object.keys(packageJson.dependencies) : []);
}

// List installed packages
console.log('\n4. Checking installed packages:');
const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  const packages = fs.readdirSync(nodeModulesPath);
  console.log('   @google/generative-ai installed:', packages.includes('@google'));
  if (packages.includes('@google')) {
    const googlePackages = fs.readdirSync(path.join(nodeModulesPath, '@google'));
    console.log('   Google packages:', googlePackages);
  }
}

// Final API key check
console.log('\n5. Final API Key Check:');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
if (process.env.GEMINI_API_KEY) {
  console.log('   Key length:', process.env.GEMINI_API_KEY.length);
  console.log('   Key format:', /^[a-zA-Z0-9_-]+$/.test(process.env.GEMINI_API_KEY) ? 'Valid' : 'Contains special characters');
}