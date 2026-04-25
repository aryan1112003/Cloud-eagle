# Country Information AI Agent

An AI-powered country assistant that answers natural language questions using a structured 3-step LangGraph pipeline and grounded data from the REST Countries API.

Tech stack: LangGraph, LangChain, FastAPI, React, Vite, Tailwind CSS, OpenRouter

## Features

- Natural language country Q and A.
- 3-step agent workflow: intent extraction, country data fetch, response synthesis.
- Grounded answers using REST Countries data (reduced hallucination risk).
- Source-aware response payload including detected country and requested fields.
- Error handling for invalid questions, missing countries, and upstream API failures.
- FastAPI backend with CORS support and health endpoint.
- React chat UI with streaming-style UX and expandable 3-step trace panel.
- Automated backend tests with pytest.

## How It Works

1. Intent node parses the user question, detects country name, and requested fields.
2. Tool node fetches country data from REST Countries.
3. Synthesis node composes a concise factual answer from retrieved payload only.

Flow:

```text
User Question
      -> Intent Node (LLM)
      -> Tool Node (REST Countries API)
      -> Synthesis Node (LLM)
      -> API response
```

## Project Structure

```text
country-agent/
     backend/
          app/
               agent/
               api/
               core/
          tests/
     frontend/
          src/
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+
- OpenRouter API key

## Local Setup

### 1) Clone

```bash
git clone https://github.com/aryan1112003/Cloud-eagle.git
cd Cloud-eagle
```

### 2) Backend Setup

Linux and macOS:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Windows PowerShell:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Open backend/.env and set a real key:

```env
OPENROUTER_API_KEY=sk-or-your-real-key
```

Run backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend base URL: http://localhost:8000

### 3) Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
```

Linux and macOS:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Run frontend:

```bash
npm run dev
```

Frontend URL: http://localhost:5173

## API Reference

### Health

- Method: GET
- Path: /health
- Purpose: Service and model health

Example response:

```json
{
     "status": "ok",
     "model": "google/gemma-3-27b-it:free"
}
```

### Ask Country Question

- Method: POST
- Path: /api/v1/ask
- Body:

```json
{
     "question": "What is the capital and population of Japan?"
}
```

Example response:

```json
{
     "answer": "...",
     "country_detected": "Japan",
     "fields_requested": ["capital", "population"],
     "sources": ["restcountries.com/v3.1"]
}
```

Curl test:

```bash
curl -X POST http://localhost:8000/api/v1/ask \
     -H "Content-Type: application/json" \
     -d '{"question":"What currency does Brazil use?"}'
```

## Environment Variables

### Backend: backend/.env

| Variable | Required | Default | Description |
|---|---|---|---|
| OPENROUTER_API_KEY | Yes | sk-or-... | OpenRouter API key used by LangChain ChatOpenAI |
| MODEL_NAME | No | google/gemma-3-27b-it:free | Model identifier |
| APP_URL | No | http://localhost:8000 | Referer metadata for OpenRouter |
| ALLOWED_ORIGINS | No | ["http://localhost:5173","http://localhost:3000"] | CORS allowed origins |
| API_TIMEOUT_SEC | No | 10 | External request timeout |
| LOG_LEVEL | No | INFO | Logging verbosity |

### Frontend: frontend/.env.local

| Variable | Required | Default | Description |
|---|---|---|---|
| VITE_API_URL | No | http://localhost:8000/api/v1 | Backend API base URL |

## Running Tests

```bash
cd backend
pytest tests -v
```

## Common Issues

- 401 or model auth error: Check OPENROUTER_API_KEY in backend/.env.
- CORS errors in browser: Add frontend URL in ALLOWED_ORIGINS.
- Timeout from data source: Retry request, then increase API_TIMEOUT_SEC.
- Country not found: Use official/common country name in question.

## Deployment Guide

### Backend (Render or Railway)

1. Deploy backend folder as Python web service.
2. Set environment variables from backend/.env.example.
3. Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel or Netlify)

1. Deploy frontend folder as static Vite app.
2. Set build command: npm run build
3. Set output directory: dist
4. Add env variable VITE_API_URL pointing to deployed backend, for example:

```text
https://your-backend-domain/api/v1
```

## Security Notes

- Do not commit backend/.env.
- Keep API keys only in environment variables.
- Rotate compromised keys immediately.

## Roadmap Ideas

- Add caching layer to reduce LLM and API calls.
- Support multi-country comparisons.
- Add conversation history memory.
- Add CI workflow for tests and linting.
