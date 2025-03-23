import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Interview, InterviewResult } from './types';
import { updateStudent } from './students';

/**
 * Get all interviews, optionally filtered by student
 */
export const getInterviews = async (studentId?: string): Promise<Interview[]> => {
  try {
    const interviewsCollection = collection(db, 'interviews');
    let q = interviewsCollection;
    
    if (studentId) {
      q = query(interviewsCollection, where('student_id', '==', studentId));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      interview_id: doc.id,
      ...doc.data()
    } as Interview));
  } catch (error) {
    console.error('Error getting interviews:', error);
    throw error;
  }
};

/**
 * Get a specific interview by ID
 */
export const getInterview = async (interviewId: string): Promise<Interview | null> => {
  try {
    const interviewDoc = doc(db, 'interviews', interviewId);
    const snapshot = await getDoc(interviewDoc);
    
    if (snapshot.exists()) {
      return {
        interview_id: snapshot.id,
        ...snapshot.data()
      } as Interview;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting interview:', error);
    throw error;
  }
};

/**
 * Schedule a new interview
 */
export const scheduleInterview = async (interview: Omit<Interview, 'interview_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const interviewsCollection = collection(db, 'interviews');
    const docRef = await addDoc(interviewsCollection, {
      ...interview,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error scheduling interview:', error);
    throw error;
  }
};

/**
 * Update an existing interview
 */
export const updateInterview = async (interviewId: string, interview: Partial<Interview>): Promise<void> => {
  try {
    const interviewDoc = doc(db, 'interviews', interviewId);
    await updateDoc(interviewDoc, {
      ...interview,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating interview:', error);
    throw error;
  }
};

/**
 * Delete an interview
 */
export const deleteInterview = async (interviewId: string): Promise<void> => {
  try {
    const interviewDoc = doc(db, 'interviews', interviewId);
    await deleteDoc(interviewDoc);
  } catch (error) {
    console.error('Error deleting interview:', error);
    throw error;
  }
};

/**
 * Get interview results, optionally filtered by student or interview
 */
export const getInterviewResults = async (studentId?: string, interviewId?: string): Promise<InterviewResult[]> => {
  try {
    const resultsCollection = collection(db, 'interview_results');
    let q = resultsCollection;
    
    if (studentId && interviewId) {
      q = query(
        resultsCollection, 
        where('student_id', '==', studentId),
        where('interview_id', '==', interviewId)
      );
    } else if (studentId) {
      q = query(resultsCollection, where('student_id', '==', studentId));
    } else if (interviewId) {
      q = query(resultsCollection, where('interview_id', '==', interviewId));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      interview_result_id: doc.id,
      ...doc.data()
    } as InterviewResult));
  } catch (error) {
    console.error('Error getting interview results:', error);
    throw error;
  }
};

/**
 * Get a specific interview result by ID
 */
export const getInterviewResult = async (resultId: string): Promise<InterviewResult | null> => {
  try {
    const resultDoc = doc(db, 'interview_results', resultId);
    const snapshot = await getDoc(resultDoc);
    
    if (snapshot.exists()) {
      return {
        interview_result_id: snapshot.id,
        ...snapshot.data()
      } as InterviewResult;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting interview result:', error);
    throw error;
  }
};

/**
 * Create a new interview result
 */
export const createInterviewResult = async (result: Omit<InterviewResult, 'interview_result_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const resultsCollection = collection(db, 'interview_results');
    const docRef = await addDoc(resultsCollection, {
      ...result,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    // Update student record to mark first interview as completed
    await updateStudent(result.student_id, {
      first_interview_completed: true,
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating interview result:', error);
    throw error;
  }
};

/**
 * Get upcoming interviews for a student
 */
export const getUpcomingInterviews = async (studentId: string): Promise<Interview[]> => {
  try {
    const interviewsCollection = collection(db, 'interviews');
    const now = new Date();
    
    // Note: This is a simplified version. In a real implementation, you would need
    // to handle the date comparison differently since Firestore timestamps work differently.
    const q = query(
      interviewsCollection,
      where('student_id', '==', studentId),
      where('date', '>=', now)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      interview_id: doc.id,
      ...doc.data()
    } as Interview));
  } catch (error) {
    console.error('Error getting upcoming interviews:', error);
    throw error;
  }
};

/**
 * Get past interviews for a student
 */
export const getPastInterviews = async (studentId: string): Promise<Interview[]> => {
  try {
    const interviewsCollection = collection(db, 'interviews');
    const now = new Date();
    
    // Note: This is a simplified version. In a real implementation, you would need
    // to handle the date comparison differently since Firestore timestamps work differently.
    const q = query(
      interviewsCollection,
      where('student_id', '==', studentId),
      where('date', '<', now)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      interview_id: doc.id,
      ...doc.data()
    } as Interview));
  } catch (error) {
    console.error('Error getting past interviews:', error);
    throw error;
  }
};
