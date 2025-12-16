# Project Overview

This repository contains both the **frontend** (built with Vite/React) and the **backend** (deployed with AWS Serverless Framework).  
The backend provides a secure, serverless API layer that connects the frontend to OpenAI without exposing API keys in the browser.

---

## Run Locally

**Prerequisites:**
- Node.js 20 or higher  
- npm 9 or higher  
- AWS CLI (optional, if you plan to deploy or test backend locally)

### 1. Install dependencies

At the project root, install all dependencies:

```bash
npm ci
```

### 2. Configure environment variables

Copy the example environment file and update it with your own settings:

```bash
cp .env.example .env.local
```

Inside `.env.local`, set:

```bash
OPENAI_API_KEY=your_openai_api_key_here
VITE_API_URL=http://localhost:3000/dev/api/openai
```

- `OPENAI_API_KEY`: only used for **local testing** (the deployed backend uses AWS Secrets or environment variables in Lambda).  
- `VITE_API_URL`: the API endpoint used by the frontend to reach your backend.

### 3. Start the development server

```bash
npm run dev
```

This will start the Vite development server at `http://localhost:5173` (default).  
When running locally, the app connects to the local backend if configured, or to the remote AWS API Gateway endpoint.

### 4. Run local backend (optional)

You can test the backend locally via Serverless Offline (if installed):

```bash
npx serverless offline
```

This simulates API Gateway and Lambda locally, allowing end-to-end testing before deployment.

---

## Deploy to AWS (Secure Backend)

This project’s backend uses **AWS Lambda + API Gateway + DynamoDB (TTL)** to handle asynchronous OpenAI requests securely.  
It follows this architecture:

```
Browser → API Gateway → Lambda (submit-job) → DynamoDB (job table)
DynamoDB → Lambda (worker) → OpenAI
Browser → API Gateway → Lambda (get-job-status)
```

### AWS Resources

- **API Gateway**: provides `/api/openai` and `/api/openai/{jobId}` endpoints.
- **Lambda Functions**:
  - `submitJob` → accepts requests, creates job entry in DynamoDB, and asynchronously invokes the worker.
  - `getJobStatus` → returns job status and result.
  - `processOpenAIWorker` → performs the OpenAI API call and stores results.
- **DynamoDB Table**: tracks job states with automatic 24-hour TTL cleanup.

---

## One-Time AWS Setup (if deploying manually)

1. **Configure AWS credentials**  
   Set up your local AWS CLI profile:
   ```bash
   aws configure
   ```
   Provide your AWS access key, secret key, and region (e.g., `eu-north-1`).

2. **Set your OpenAI API key for Lambda environment**  
   ```bash
   export OPENAI_API_KEY=your_openai_key_here
   ```

3. **Deploy the backend**
   ```bash
   npx serverless deploy --stage dev --region eu-north-1
   ```

4. **Get the API URL**  
   After deployment, you’ll see output like:
   ```
   POST - https://abc123.execute-api.eu-north-1.amazonaws.com/dev/api/openai
   GET  - https://abc123.execute-api.eu-north-1.amazonaws.com/dev/api/openai/{jobId}
   ```

5. **Update frontend environment**  
   Add the endpoint to your `.env.local`:
   ```
   VITE_API_URL=https://abc123.execute-api.eu-north-1.amazonaws.com/dev/api/openai
   ```

6. **Build and deploy frontend**
   ```bash
   npm run build
   ```
   Then deploy the contents of `/dist` to **AWS Amplify**, **S3**, or another static host.

---

## Frontend (Amplify)

The frontend build and deployment are handled by **AWS Amplify** using the `amplify.yml` file in the root directory.

**amplify.yml**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - ~/.npm/**/*
```

This ensures that each time code is pushed to the connected branch, Amplify automatically installs dependencies, builds the project, and publishes the `dist` folder.

---

## Backend CI/CD (GitHub Actions)

Backend deployments are fully automated using **GitHub Actions** and **AWS OIDC federation**.  
This avoids long-lived AWS keys and deploys securely from your repo.

### Workflow summary

- Trigger: on push to the `dev` branch  
- Jobs:
  - Checkout repo
  - Set up Node.js
  - Assume AWS IAM role via OIDC
  - Run `npm ci`
  - Run `npx serverless deploy`

### IAM Role (for OIDC)

The GitHub Actions role was created in AWS IAM with:
- **Trusted entity:** `token.actions.githubusercontent.com`
- **Audience:** `sts.amazonaws.com`
- **Trust policy:** restricted to `repo:fmolla-company/my-chatbot:ref:refs/heads/dev`
- **Permissions:** temporarily `AdministratorAccess` (to allow CloudFormation and Lambda deployments)

### GitHub Secrets

- `OPENAI_API_KEY`: securely injected during the deploy job

### Workflow file

Located at `.github/workflows/deploy-backend-dev.yml`:

```yaml
name: deploy-backend-dev
on:
  push:
    branches: ["dev"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    env:
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::155574108262:role/github-actions-my-chatbot-dev
          aws-region: eu-north-1
      - name: Install dependencies
        run: npm ci
      - name: Deploy backend
        run: npx serverless deploy --stage dev --region eu-north-1
```

---

## Current Architecture Diagram

```
 ┌────────────┐      ┌──────────────┐      ┌────────────┐
 │  Frontend  │ ───▶ │ API Gateway  │ ───▶ │ Lambda:    │
 │ (Amplify)  │      │  (HTTP API)  │      │ submitJob  │
 └────────────┘      └─────┬────────┘      └────┬───────┘
                            │                  │
                            ▼                  ▼
                     ┌────────────┐       ┌──────────────┐
                     │ DynamoDB   │◀────▶│ Lambda:      │
                     │ Jobs Table │       │ processOpenAI│
                     └────────────┘       └────┬─────────┘
                                               │
                                               ▼
                                         ┌───────────┐
                                         │  OpenAI   │
                                         └───────────┘

         ▲
         │
         └─────────── Lambda: getJobStatus
```

---

## What We’ve Implemented Recently

### CI/CD Backend Integration
- Automated deployment pipeline for the Serverless backend using **GitHub Actions**.
- Validated stack `bmg-chatbot-api-dev` and confirmed CloudFormation-managed resources.
- Replaced insecure SSO role with a dedicated **GitHub OIDC IAM role** for secure auth.
- Configured `OPENAI_API_KEY` as GitHub Secret, injected at deploy time.
- Verified backend deploys independently of Amplify and updates on every push to `dev`.

### CI/CD Frontend Integration
- Confirmed Amplify builds only frontend (via `amplify.yml`) and is unaffected by backend pipeline.
- Cleaned repo, removed `node_modules` and sensitive `.env` files from version control.

---

## Summary

This project now has a **complete serverless and CI/CD architecture**:
- Frontend: deployed via **AWS Amplify**  
- Backend: deployed via **Serverless Framework + GitHub Actions (OIDC)**  
- Infrastructure: **API Gateway**, **Lambda**, and **DynamoDB (TTL)**  
- Security: OpenAI key managed through backend only (never exposed to browser)

Pushes to the `dev` branch automatically:
- Run tests/build
- Deploy backend to AWS
- Trigger Amplify to rebuild frontend

This ensures both the AI use-case analyzer frontend and the serverless backend stay in sync, deployed, and secure.

## What is this? 

I will walk you through it and what is possible: 
 
overview0.png: here you can see 6 premade use cases, which you can run through the AI Use Cases Analyzer (AUCA). You also see an option to add your own use case, this has an option to be optimized by AI itself, which essentially can turn poorly written text or a sentence etc into a full use case. 
<img width="1166" height="844" alt="overview0" src="https://github.com/user-attachments/assets/cebee4d1-71f1-4049-81ff-947d936215b2" />


overview1.png: this is the interface currently for the AUCA. overview1.1.png shows you the workflow, it goes from the highest risk (unacceptable), to high risk, limited, and then if all are passed, the use case will receive the lowest, minimal/no risk. 
 <img width="1319" height="895" alt="overview1" src="https://github.com/user-attachments/assets/1b5fc874-003c-4a71-ae01-4b0a22693c92" />
 <img width="409" height="438" alt="overview1 1" src="https://github.com/user-attachments/assets/cc7945fc-33d0-40c5-9e9f-24e7b724ac3a" />


overview2.png: each use case is checked against the EU AI Act text, and an AI analysis is given and references to the text are made in-line. You can click on the hyperlinks and read the referenced sections right there in the tool. 
 <img width="620" height="417" alt="overview2" src="https://github.com/user-attachments/assets/a2524efb-cc6c-48bb-a7ce-4c1411853465" />

overview3.png: if you want, you can also disagree with the AI assessment, for example, I did so here. If you do that, it will prompt you to say why you disagree and this will be taken into account for the final assessment and executive summary etc. again, if you accept a risk level, the further checks are aborted as they are only of lower risk. 
<img width="619" height="360" alt="overview3" src="https://github.com/user-attachments/assets/151d0e35-b9e0-4a07-bdd0-fa0c42c93f23" />

overview5.png: the first page of the pdf report that is generated, it should contain the use case, the summary, as well as the final risk level assessed
 <img width="796" height="772" alt="overview5" src="https://github.com/user-attachments/assets/1f90cdf8-6336-43f2-9731-cdbac66c9b95" />

overview6.png: the executive summary of why the actions were taken etc, this document should ideally be VERY transparent. It needs to stand up to legal tests of why these decisions were made, so the LLM citing the EU AI Act should be in here. 
 <img width="827" height="668" alt="overview6" src="https://github.com/user-attachments/assets/9a1978f9-fdcd-402b-9117-0609fdbda5c9" />

