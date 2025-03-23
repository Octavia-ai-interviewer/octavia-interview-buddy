import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Institution } from './types';

/**
 * Get all institutions
 */
export const getInstitutions = async (): Promise<Institution[]> => {
  try {
    const institutionsCollection = collection(db, 'institutions');
    const snapshot = await getDocs(institutionsCollection);
    return snapshot.docs.map(doc => ({
      institution_id: doc.id,
      ...doc.data()
    } as Institution));
  } catch (error) {
    console.error('Error getting institutions:', error);
    throw error;
  }
};

/**
 * Get a specific institution by ID
 */
export const getInstitution = async (institutionId: string): Promise<Institution | null> => {
  try {
    const institutionDoc = doc(db, 'institutions', institutionId);
    const snapshot = await getDoc(institutionDoc);
    
    if (snapshot.exists()) {
      return {
        institution_id: snapshot.id,
        ...snapshot.data()
      } as Institution;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting institution:', error);
    throw error;
  }
};

/**
 * Create a new institution
 */
export const createInstitution = async (institution: Omit<Institution, 'institution_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const institutionsCollection = collection(db, 'institutions');
    const docRef = await addDoc(institutionsCollection, {
      ...institution,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating institution:', error);
    throw error;
  }
};

/**
 * Update an existing institution
 */
export const updateInstitution = async (institutionId: string, institution: Partial<Institution>): Promise<void> => {
  try {
    const institutionDoc = doc(db, 'institutions', institutionId);
    await updateDoc(institutionDoc, {
      ...institution,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating institution:', error);
    throw error;
  }
};

/**
 * Delete an institution
 */
export const deleteInstitution = async (institutionId: string): Promise<void> => {
  try {
    const institutionDoc = doc(db, 'institutions', institutionId);
    await deleteDoc(institutionDoc);
  } catch (error) {
    console.error('Error deleting institution:', error);
    throw error;
  }
};
