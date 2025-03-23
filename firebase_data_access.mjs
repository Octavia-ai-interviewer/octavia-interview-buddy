import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./firebase_admin_config.json', 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://octavia-9ad85.firebaseio.com' // Replace with your database URL
});

const db = admin.firestore();

async function getResumeAnalytics() {
  try {
    const resumeAnalyticsCollection = db.collection('resume_analytics');
    const snapshot = await resumeAnalyticsCollection.limit(5).get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (error) {
    console.error('Error getting resume analytics:', error);
  }
}

getResumeAnalytics();
