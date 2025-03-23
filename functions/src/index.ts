import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Initialize VAPI client with your private key
// Note: In a real implementation, you would use the VAPI SDK
// For now, we'll simulate the VAPI client functionality
const vapiClient = {
  getConversation: async (conversationId: string) => {
    // Simulate fetching conversation data from VAPI
    // In a real implementation, this would call the VAPI API
    return {
      id: conversationId,
      messages: [
        { role: "assistant", content: "Hello, I'm Octavia. How can I help you today?" },
        { role: "user", content: "I'm preparing for a job interview." },
        { role: "assistant", content: "Great! What kind of job are you interviewing for?" },
        { role: "user", content: "It's a software engineering position." },
        { role: "assistant", content: "Excellent! Let's practice some common software engineering interview questions." }
      ]
    };
  }
};

// Generate interview report using VAPI
export const generateInterviewReport = onRequest(async (request, response) => {
  try {
    const { interviewId } = request.query;
    
    if (!interviewId) {
      response.status(400).send("Interview ID is required");
      return;
    }
    
    // Get interview data from Firestore
    const interviewDoc = await db.collection('interviews').doc(String(interviewId)).get();
    
    if (!interviewDoc.exists) {
      response.status(404).send("Interview not found");
      return;
    }
    
    const interviewData = interviewDoc.data();
    
    if (!interviewData?.vapi_conversation_id) {
      response.status(400).send("Interview does not have a VAPI conversation ID");
      return;
    }
    
    // Get conversation data from VAPI
    const conversation = await vapiClient.getConversation(interviewData.vapi_conversation_id);
    
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
  } catch (error: any) {
    console.error("Error generating interview report:", error);
    response.status(500).send(`Error generating interview report: ${error.message}`);
  }
});

// Process new interviews when they're completed
export const processCompletedInterview = onDocumentCreated('interviews/{interviewId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log('No data associated with the event');
    return;
  }
  
  const interviewData = snapshot.data();
  
  if (interviewData.status !== 'completed') {
    return;
  }
  
  try {
    // Process the interview data
    console.log(`Processing completed interview: ${event.params.interviewId}`);
    
    // Store metadata about the interview
    await db.collection('interview_analytics').add({
      interview_id: event.params.interviewId,
      student_id: interviewData.student_id,
      institution_id: interviewData.institution_id,
      department_id: interviewData.department_id || null,
      completion_time: interviewData.completion_time || null,
      duration_seconds: interviewData.duration_seconds || null,
      question_count: interviewData.questions?.length || 0,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
  } catch (error: any) {
    console.error("Error processing completed interview:", error);
  }
});

// Helper function to process conversation data
interface ConversationMessage {
  role: string;
  content: string;
}

interface Conversation {
  id: string;
  messages: ConversationMessage[];
}

interface Report {
  score: number;
  feedback: string;
  categories: {
    communication: number;
    technical_knowledge: number;
    problem_solving: number;
  };
}

function processConversationData(conversation: Conversation): Report {
  // This is a simplified implementation
  // In a real-world scenario, you would analyze the conversation data
  // to generate scores, feedback, and categories
  
  // Extract messages from the conversation
  const messages = conversation.messages || [];
  
  // Calculate a basic score based on message count and length
  const messageCount = messages.length;
  const totalLength = messages.reduce((sum: number, msg: ConversationMessage) => sum + (msg.content?.length || 0), 0);
  const avgLength = messageCount > 0 ? totalLength / messageCount : 0;
  
  // Generate a score between 60-95 based on message count and average length
  const baseScore = 70;
  const messageCountScore = Math.min(15, messageCount / 2);
  const lengthScore = Math.min(10, avgLength / 20);
  const score = Math.round(baseScore + messageCountScore + lengthScore);
  
  // Generate feedback based on the score
  let feedback = "";
  if (score >= 90) {
    feedback = "Excellent communication skills demonstrated throughout the interview. Responses were clear, concise, and demonstrated strong understanding of the subject matter.";
  } else if (score >= 80) {
    feedback = "Good communication skills shown during the interview. Most responses were clear and demonstrated good understanding of the topics discussed.";
  } else if (score >= 70) {
    feedback = "Satisfactory communication during the interview. Some responses could be more detailed or clearer, but overall demonstrated adequate understanding.";
  } else {
    feedback = "Communication during the interview could be improved. Consider providing more detailed responses and demonstrating deeper understanding of the topics.";
  }
  
  // Generate category scores
  const categories = {
    communication: Math.min(100, score + Math.floor(Math.random() * 10)),
    technical_knowledge: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
    problem_solving: Math.min(100, score + Math.floor(Math.random() * 10) - 2)
  };
  
  return {
    score,
    feedback,
    categories
  };
}

// Monitor VAPI concurrency usage
export const getVapiConcurrencyUsage = onRequest(async (request, response) => {
  try {
    // In a real implementation, you would query VAPI's API to get current concurrency usage
    // For now, we'll return a mock response
    
    const mockConcurrencyData = {
      total_concurrency_limit: 10, // Default limit
      current_active_sessions: 3,
      peak_sessions_today: 7,
      peak_sessions_this_week: 9,
      recommended_additional_slots: 0
    };
    
    // Calculate if additional slots are recommended
    if (mockConcurrencyData.peak_sessions_this_week >= mockConcurrencyData.total_concurrency_limit * 0.8) {
      mockConcurrencyData.recommended_additional_slots = 
        Math.ceil((mockConcurrencyData.peak_sessions_this_week * 1.2 - mockConcurrencyData.total_concurrency_limit) / 5) * 5;
    }
    
    response.send(mockConcurrencyData);
  } catch (error: any) {
    console.error("Error getting VAPI concurrency usage:", error);
    response.status(500).send("Error getting VAPI concurrency usage");
  }
});
