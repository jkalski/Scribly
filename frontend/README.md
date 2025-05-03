# Scribly - AI Resume Feedback

Scribly is a web application that analyzes resumes using Google's Gemini AI and provides detailed, constructive feedback to help users improve their resumes.

## Features

- **Resume Analysis**: Upload your resume as PDF or DOCX and receive AI-powered feedback
- **Detailed Feedback**: Get comprehensive analysis including:
  - Overall score assessment
  - Key strengths identification
  - Areas for improvement
  - Specific suggestions for enhancement
  - Section-by-section analysis
- **Preview Extraction**: View the extracted text to ensure proper parsing of your resume

## Technology Stack

### Backend
- Node.js
- Express.js
- Google Gemini 1.5 Pro AI
- PDF and DOCX text extraction (pdfreader, mammoth)
- Multer for file uploads

### Frontend
- React 19
- Vite
- Axios for API requests

## Installation

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Google AI Studio API key

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/scribly.git
cd scribly
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Configure environment variables
Create a `.env` file in the backend directory:
```
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server
```bash
cd backend
node index.js
```
You should see a message indicating the server is running on port 5000.

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Open the application in your browser at the URL provided by Vite (typically http://localhost:5173)

## Usage

1. Open the application in your web browser
2. Click to upload your resume (PDF or DOCX format)
3. Click "Analyze Resume"
4. Review the extracted text to confirm proper parsing
5. Review the detailed analysis and suggestions for improving your resume

## Getting a Google AI API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in or create an account
3. Generate a new API key
4. Copy the key to your `.env` file

## Troubleshooting

### Common Issues

- **API key errors**: Ensure your Gemini API key is valid and properly set in the `.env` file
- **File upload issues**: Make sure you're uploading PDF or DOCX files only
- **Backend connection errors**: Check that your backend is running on port 5000 and that there are no CORS issues

### Error Logs

Check the console output of both the frontend and backend for detailed error messages.

## Future Enhancements

- User authentication and saved resume history
- Customized analysis for different industries/roles
- Comparison with job descriptions for targeted optimization
- Improved PDF text extraction for complex layouts
- Mobile-responsive design improvements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

## Acknowledgements

- Google Gemini AI for powering the resume analysis
- Open source libraries for PDF and DOCX parsing
- React and Vite development teams