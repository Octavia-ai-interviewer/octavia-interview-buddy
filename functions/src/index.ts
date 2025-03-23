/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";

// Firebase function to generate interview report
export const generateInterviewReport = onRequest(async (request, response) => {
  try {
    // Call VAPI to generate the interview report
    const report = { message: "VAPI report generation is not yet implemented" };

    // Send the report back to the client
    response.send(report);
  } catch (error) {
    response.status(500).send("Error generating interview report");
  }
});
