---
description: Repository Information Overview
alwaysApply: true
---

# AI Job Navigator - Repository Information

## Repository Summary
AI Job Navigator is a full-stack web application that helps users discover job opportunities based on their resume skills. It combines resume parsing, LLM-powered skill extraction, and job search APIs to provide personalized job recommendations. The application consists of a FastAPI backend and a React frontend with Vite.

## Repository Structure
The repository is organized as a multi-project application:

- **backend/**: FastAPI REST API server with user authentication and job search functionality
- **frontend/**: React application with Vite bundler for the user interface
- **venv/**: Python virtual environment for root-level dependencies

### Main Repository Components
- **Backend API**: FastAPI server handling authentication, resume parsing, and job recommendations
- **Frontend UI**: React SPA with Tailwind CSS for responsive design
- **Database**: MongoDB for user and job data storage
- **External Integrations**: RapidAPI (Indeed job search), Groq API (LLM-based skill extraction)

## Projects

### Backend (FastAPI Python)
**Configuration File**: ackend/requirements.txt, ackend/.env

#### Language & Runtime
**Language**: Python
**Version**: Python 3.13 (from venv Scripts)
**Build System**: pip
**Package Manager**: pip

#### Dependencies
**Main Dependencies**:
- fastapi - Web framework
- uvicorn - ASGI server
- PyPDF2 - PDF resume parsing
- groq - LLM API client for skill extraction
- requests - HTTP client for external APIs
- python-dotenv - Environment variable management
- python-multipart - Multipart form data handling

**Development Setup**:
- Virtual environment located at ackend/venv/

#### Build & Installation
\\\ash
cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
\\\

#### Main Application Structure
**Entry Point**: ackend/main.py
- FastAPI app with CORS middleware
- Frontend origin: http://localhost:5173

**Routes**:
- /auth/* - Authentication routes (signup, login)
- /api/* - Job-related endpoints (resume upload, job search)

**Key Modules**:
- outes/auth.py - User authentication with bcrypt password hashing
- outes/jobs.py - Resume upload, skill extraction via Groq LLM, job search via RapidAPI
- models.py - Pydantic models for User and Job
- database.py - MongoDB connection and data management

#### Configuration
**Environment Variables** (.env):
- MONGO_URI - MongoDB connection string
- RAPIDAPI_KEY - RapidAPI key for Indeed job search
- GROQ_API_KEY - Groq API key for LLM skill extraction

#### Running the Backend
\\\ash
# Activate virtual environment
backend\\venv\\Scripts\\activate

# Start the server (development)
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
\\\

---

### Frontend (React + Vite)
**Configuration File**: rontend/package.json

#### Language & Runtime
**Language**: JavaScript/JSX with React 19
**Build Tool**: Vite 7.1.7
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- react@19.1.1 - UI library
- react-dom@19.1.1 - React DOM rendering
- react-router-dom@7.9.4 - Client-side routing
- lucide-react@0.548.0 - Icon library

**Development Dependencies**:
- @vitejs/plugin-react - Vite React plugin
- tailwindcss@4.1.16 - Utility-first CSS framework
- @tailwindcss/postcss@4.1.16 - PostCSS integration
- eslint@9.36.0 - Code linting
- babel-plugin-react-compiler - React compiler for optimization

#### Build & Installation
\\\ash
cd frontend
npm install
npm run dev          # Start development server (Vite)
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
\\\

#### Main Application Structure
**Entry Point**: rontend/src/main.jsx
**Application Root**: rontend/src/App.jsx
**HTML Entry**: rontend/index.html

**Configuration Files**:
- ite.config.js - Vite bundler configuration
- 	ailwind.config.js - Tailwind CSS configuration
- postcss.config.js - PostCSS configuration
- eslint.config.js - ESLint rules

#### Development Server
\\\ash
npm run dev
# Serves on http://localhost:5173
\\\

#### Production Build
\\\ash
npm run build
# Output: frontend/dist/
\\\

---

## Environment Setup
Both projects require proper environment configuration to function:

### Backend Environment Variables
Create/update ackend/.env:
\\\
MONGO_URI=your_mongodb_connection_string
RAPIDAPI_KEY=your_rapidapi_key
GROQ_API_KEY=your_groq_api_key
\\\

### CORS Configuration
Backend is configured to accept requests from http://localhost:5173 (frontend dev server).

## Workflow
1. **Frontend Development**: Run 
pm run dev in the frontend directory
2. **Backend Development**: Activate venv and run uvicorn backend.main:app --reload
3. **Frontend connects to**: Backend API at http://localhost:8000
4. **Build for Production**: 
pm run build for frontend, package backend with Gunicorn/similar

