# Project Structure

## Overview
This project is structured as a monorepo with clearly separated frontend and backend.

```
euaiact-assessment/
├── frontend/              # React + Vite frontend application
│   ├── components/        # React components
│   ├── services/          # API service layer
│   ├── App.tsx           # Main app component
│   ├── index.tsx         # Entry point
│   ├── types.ts          # TypeScript type definitions
│   ├── constants.ts      # App constants
│   ├── vite.config.ts    # Vite configuration
│   ├── tsconfig.json     # TypeScript config
│   ├── package.json      # Frontend dependencies
│   ├── .env.local        # Local development env vars
│   └── .env.production   # Production env vars
│
├── backend/              # AWS Lambda serverless backend
│   ├── src/
│   │   ├── handlers/     # Lambda function handlers
│   │   │   ├── submit-job.ts
│   │   │   ├── get-job-status.ts
│   │   │   └── openai-worker.ts
│   │   ├── services/     # Business logic services (future)
│   │   └── types/        # Backend type definitions (future)
│   ├── serverless.yml    # Serverless Framework config
│   ├── tsconfig.json     # TypeScript config
│   └── package.json      # Backend dependencies
│
├── amplify.yml           # AWS Amplify deployment config
├── package.json          # Root workspace scripts
├── .env.example          # Environment variables template
├── README.md             # Project documentation
└── EUAIACT.pdf          # EU AI Act reference document

```

## Quick Start

### Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or individually
npm run install:frontend
npm run install:backend
```

### Development

```bash
# Run frontend in dev mode (localhost:3001)
npm run dev
```

### Build & Deploy

```bash
# Build frontend only
npm run build:frontend

# Deploy backend only
npm run deploy:backend

# Build frontend + deploy backend
npm run deploy:all
```

## Frontend

**Tech Stack:**
- React 19
- TypeScript
- Vite
- Hosted on AWS Amplify

**Key Files:**
- `services/openaiService.ts` - API integration with async job polling
- `components/` - UI components
- `App.tsx` - Main application logic

## Backend

**Tech Stack:**
- AWS Lambda (Node.js 20)
- TypeScript
- Serverless Framework
- DynamoDB for job storage
- API Gateway (REST API)

**Architecture:**
- Async job pattern to support long-running OpenAI requests (up to 15 min)
- 3 Lambda functions:
  - `submitJob` - Accepts requests, returns job ID
  - `getJobStatus` - Polls for completion
  - `processOpenAIWorker` - Processes OpenAI API calls

**Endpoints:**
- POST `/api/openai` - Submit job
- GET `/api/openai/{jobId}` - Get job status

## Environment Variables

### Frontend (.env.local)
```bash
VITE_API_URL=https://your-api-gateway-url/dev/api/openai
```

### Backend (set via serverless deploy)
```bash
OPENAI_API_KEY=sk-proj-...
```

## Deployment

### Backend
```bash
cd backend
export OPENAI_API_KEY=your_key
npm run deploy
```

### Frontend (Amplify)
Push to GitHub - auto-deploys via CI/CD
Or manually via Amplify console

## Notes
- Frontend polls backend every 1 second for up to 2 minutes
- Backend worker can run for up to 15 minutes
- DynamoDB jobs have 24-hour TTL for auto-cleanup
