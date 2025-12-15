
## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to AWS (Secure with Lambda Functions)

This app uses AWS Lambda functions to keep your API key secure on the server.

### Quick Start with AWS

1. **Configure AWS credentials** (one-time setup):
   ```bash
   aws configure
   ```

2. **Set your OpenAI API key**:
   ```bash
   export OPENAI_API_KEY=your_key_here
   ```

3. **Deploy to AWS**:
   ```bash
   npx serverless deploy
   ```

4. **Update frontend with your API URL**:
   - Copy the API endpoint from the deploy output
   - Create `.env.local` and add:
     ```
     VITE_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/api/openai
     ```

5. **Build and deploy frontend**:
   ```bash
   npm run build
   # Deploy dist/ folder to S3, Amplify, or any static host
   ```

See [deploy-aws.md](./deploy-aws.md) for detailed instructions.

### Alternative: Deploy to Vercel/Netlify

See [deploy-aws.md](./deploy-aws.md) for other deployment options including Vercel and Netlify.


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

