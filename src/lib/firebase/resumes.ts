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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { Resume } from './types';
import { updateStudent } from './students';

/**
 * Get all resumes, optionally filtered by student
 */
export const getResumes = async (studentId?: string): Promise<Resume[]> => {
  try {
    const resumesCollection = collection(db, 'resumes');
    let q = resumesCollection;
    
    if (studentId) {
      q = query(resumesCollection, where('student_id', '==', studentId));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      resume_id: doc.id,
      ...doc.data()
    } as Resume));
  } catch (error) {
    console.error('Error getting resumes:', error);
    throw error;
  }
};

/**
 * Get a specific resume by ID
 */
export const getResume = async (resumeId: string): Promise<Resume | null> => {
  try {
    const resumeDoc = doc(db, 'resumes', resumeId);
    const snapshot = await getDoc(resumeDoc);
    
    if (snapshot.exists()) {
      return {
        resume_id: snapshot.id,
        ...snapshot.data()
      } as Resume;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  }
};

/**
 * Upload a resume file and create a resume document
 */
export const uploadResume = async (studentId: string, file: File): Promise<string> => {
  try {
    // Upload file to storage
    const storageRef = ref(storage, `resumes/${studentId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    
    // Create resume document
    const resumesCollection = collection(db, 'resumes');
    const docRef = await addDoc(resumesCollection, {
      student_id: studentId,
      resume_data: '', // This will be populated by a Cloud Function that processes the resume
      upload_date: serverTimestamp(),
      file_url: fileUrl,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    // Update student record
    await updateStudent(studentId, {
      resume_uploaded: true,
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

/**
 * Update resume data (typically called by a Cloud Function after processing)
 */
export const updateResumeData = async (resumeId: string, resumeData: string): Promise<void> => {
  try {
    const resumeDoc = doc(db, 'resumes', resumeId);
    await updateDoc(resumeDoc, {
      resume_data: resumeData,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating resume data:', error);
    throw error;
  }
};

/**
 * Delete a resume
 */
export const deleteResume = async (resumeId: string): Promise<void> => {
  try {
    const resumeDoc = doc(db, 'resumes', resumeId);
    await deleteDoc(resumeDoc);
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

/**
 * Get the latest resume for a student
 */
export const getLatestResume = async (studentId: string): Promise<Resume | null> => {
  try {
    const resumesCollection = collection(db, 'resumes');
    const q = query(
      resumesCollection,
      where('student_id', '==', studentId),
      where('upload_date', '!=', null)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    // Sort by upload date (newest first)
    const sortedDocs = snapshot.docs.sort((a, b) => {
      const dateA = a.data().upload_date?.toDate() || new Date(0);
      const dateB = b.data().upload_date?.toDate() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return {
      resume_id: sortedDocs[0].id,
      ...sortedDocs[0].data()
    } as Resume;
  } catch (error) {
    console.error('Error getting latest resume:', error);
    throw error;
  }
};
