# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/21bb4659-713c-41f1-bac2-54d39a22da7b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/21bb4659-713c-41f1-bac2-54d39a22da7b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Project Status

This project is currently being prepared for Firebase integration. A new MCP server is being created to access data from another Firebase project.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase Admin SDK (for backend data access)
- Model Context Protocol (MCP) SDK (for MCP server)

## How can I run this project locally?

1. Clone the repository:
   ```bash
   git clone <YOUR_GIT_URL>
   ```
2. Navigate to the project directory:
   ```bash
   cd octavia-interview-buddy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Generate a new private key for your service account in Project Settings > Service Accounts
   - Copy the `firebase_admin_config.json.example` file to `firebase_admin_config.json`
   - Replace the placeholder values with your actual Firebase service account credentials
5. Start the development server:
   ```bash
   npm run dev
   ```

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Setting Up VAPI for Production in Firebase

### Overview

Octavia Interview Buddy uses VAPI (Voice API) to power AI-driven interview experiences. This section provides comprehensive guidance on setting up VAPI for production in Firebase, with a focus on scalability for multiple institutions.

### VAPI Integration Architecture

The platform integrates VAPI at two levels:

1. **Client-side Integration**: Uses the `@vapi-ai/web` SDK in the InterviewInterface component to handle real-time voice conversations.
2. **Server-side Integration**: Uses Firebase Functions with the `@vapi-ai/server-sdk` to process interview data, generate reports, and store analytics.

### Production Setup Instructions

#### 1. Environment Variables Configuration

Create a `.env` file in the root directory with the following VAPI credentials:

```
# VAPI Configuration
VITE_VAPI_PUBLIC_KEY=your-vapi-public-key
VITE_VAPI_ASSISTANT_ID=your-vapi-assistant-id
```

For Firebase deployment, set these environment variables using Firebase CLI:

```bash
firebase functions:config:set vapi.public_key="your-vapi-public-key" vapi.assistant_id="your-vapi-assistant-id" vapi.private_key="your-vapi-private-key"
```

#### 2. Firebase Functions Implementation

Update the `functions/src/index.ts` file to implement the VAPI server-side integration:

```typescript
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { VapiClient } from "@vapi-ai/server-sdk";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Initialize VAPI client with your private key
const vapiClient = new VapiClient({
  apiKey: process.env.VAPI_PRIVATE_KEY
});

// Generate interview report using VAPI
export const generateInterviewReport = onRequest(async (request, response) => {
  try {
    const { interviewId } = request.query;
    
    if (!interviewId) {
      return response.status(400).send("Interview ID is required");
    }
    
    // Get interview data from Firestore
    const interviewDoc = await db.collection('interviews').doc(String(interviewId)).get();
    
    if (!interviewDoc.exists) {
      return response.status(404).send("Interview not found");
    }
    
    const interviewData = interviewDoc.data();
    
    // Get conversation data from VAPI
    const conversation = await vapiClient.conversations.retrieve(interviewData.vapi_conversation_id);
    
    // Process conversation data to generate report
    const report = processConversationData(conversation);
    
    // Store report in Firestore
    await db.collection('interview_results').add({
      interview_id: interviewId,
      student_id: interviewData.student_id,
      score: report.score,
      feedback: report.feedback,
      feedback_categories: report.categories,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Send the report back to the client
    response.send(report);
  } catch (error) {
    console.error("Error generating interview report:", error);
    response.status(500).send("Error generating interview report");
  }
});

// Process new interviews when they're completed
export const processCompletedInterview = onDocumentCreated('interviews/{interviewId}', async (event) => {
  const interviewData = event.data.data();
  
  if (interviewData.status !== 'completed') {
    return;
  }
  
  try {
    // Process the interview data
    // This could include generating a report, updating analytics, etc.
    console.log(`Processing completed interview: ${event.params.interviewId}`);
  } catch (error) {
    console.error("Error processing completed interview:", error);
  }
});

// Helper function to process conversation data
function processConversationData(conversation) {
  // Implement your conversation processing logic here
  // This would analyze the conversation and generate a report
  
  return {
    score: 85, // Example score
    feedback: "Great communication skills demonstrated throughout the interview...",
    categories: {
      communication: 90,
      technical_knowledge: 80,
      problem_solving: 85
    }
  };
}
```

#### 3. Security Rules Configuration

Update your Firestore security rules to protect VAPI-related data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Base rules
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Interview data
    match /interviews/{interviewId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.student_id ||
        exists(/databases/$(database)/documents/institutions/$(resource.data.institution_id)/admins/$(request.auth.uid))
      );
      allow create: if request.auth != null && request.auth.uid == request.resource.data.student_id;
      allow update: if request.auth != null && request.auth.uid == resource.data.student_id;
    }
    
    // Interview results
    match /interview_results/{resultId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.student_id ||
        exists(/databases/$(database)/documents/institutions/$(resource.data.institution_id)/admins/$(request.auth.uid))
      );
    }
  }
}
```

### Scaling for Multiple Institutions

The Octavia Interview Buddy platform is designed to scale efficiently across multiple institutions using a single VAPI account. Here's how the scaling architecture works:

#### Session-Based Allocation Model

The platform uses a dual-pricing model:
- **License-based**: Institutions pay per student ($4.99/student/quarter or $19.96/student/year)
- **Session-based**: Institutions purchase interview sessions at $0.15/minute (typically $2.25 for a 15-minute session)

Institutions can allocate sessions in various ways:
- Institution-wide (first-come, first-served)
- Per department
- Per student
- By student groups

#### Concurrency Management

VAPI accounts have a default concurrency limit of 10 simultaneous sessions, with additional concurrency available for $10/month per slot. The platform handles this through:

1. **Dynamic Concurrency Purchasing**: As your user base grows, you can purchase additional concurrency slots from VAPI to handle increased simultaneous usage.

2. **Booking Calendar System**: The built-in booking calendar naturally distributes interview sessions across time slots, preventing excessive concurrent usage.

3. **Session Reservation**: When a student selects a time slot, it's temporarily reserved to prevent double-bookings.

#### Monitoring and Analytics

To effectively manage the platform at scale:

1. Implement monitoring for VAPI concurrency usage
2. Track session usage by institution, department, and student
3. Process detailed analytics in background jobs to avoid impacting real-time performance

### Best Practices for Production

1. **Environment Variables**: Never hardcode VAPI API keys in your code. Always use environment variables.

2. **Error Handling**: Implement robust error handling for VAPI interactions, with fallback mechanisms for service disruptions.

3. **Logging**: Set up comprehensive logging for all VAPI interactions to help troubleshoot issues.

4. **Backup Strategies**: Implement regular backups of interview data and analytics.

5. **Testing**: Create a test environment with a separate VAPI account to validate changes before deploying to production.

### Conclusion

With the session-based allocation model and the ability to dynamically purchase VAPI concurrency, Octavia Interview Buddy can efficiently scale to support 100+ institutions on a single VAPI account. The architecture provides natural load distribution through the booking system while maintaining flexibility for institutions to manage their resources.

By following the setup instructions and best practices outlined above, you can deploy a robust, scalable interview platform that delivers high-quality AI interview experiences to students across multiple institutions.
