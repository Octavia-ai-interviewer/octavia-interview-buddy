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
import { Student } from './types';
import { getInstitution } from './institutions';

/**
 * Get all students, optionally filtered by institution
 */
export const getStudents = async (institutionId?: string): Promise<Student[]> => {
  try {
    const studentsCollection = collection(db, 'students');
    let q = studentsCollection;
    
    if (institutionId) {
      q = query(studentsCollection, where('institution_id', '==', institutionId));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      student_id: doc.id,
      ...doc.data()
    } as Student));
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

/**
 * Get a specific student by ID
 */
export const getStudent = async (studentId: string): Promise<Student | null> => {
  try {
    const studentDoc = doc(db, 'students', studentId);
    const snapshot = await getDoc(studentDoc);
    
    if (snapshot.exists()) {
      return {
        student_id: snapshot.id,
        ...snapshot.data()
      } as Student;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting student:', error);
    throw error;
  }
};

/**
 * Validate if an email belongs to an institution's allowed domains
 */
export const validateInstitutionEmail = async (email: string, institutionId: string): Promise<boolean> => {
  try {
    const institution = await getInstitution(institutionId);
    
    if (!institution || !institution.email_domains || institution.email_domains.length === 0) {
      return false;
    }
    
    const emailDomain = email.split('@')[1];
    return institution.email_domains.includes(emailDomain);
  } catch (error) {
    console.error('Error validating institution email:', error);
    return false;
  }
};

/**
 * Create a new student
 * When going live, this will validate that the email domain matches the institution's allowed domains
 */
export const createStudent = async (student: Omit<Student, 'student_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    // In production, uncomment this to enforce school email validation
    /*
    const isValidEmail = await validateInstitutionEmail(student.email, student.institution_id);
    if (!isValidEmail) {
      throw new Error('Email domain not allowed for this institution');
    }
    */
    
    const studentsCollection = collection(db, 'students');
    const docRef = await addDoc(studentsCollection, {
      ...student,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

/**
 * Update an existing student
 */
export const updateStudent = async (studentId: string, student: Partial<Student>): Promise<void> => {
  try {
    const studentDoc = doc(db, 'students', studentId);
    await updateDoc(studentDoc, {
      ...student,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Delete a student
 */
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    const studentDoc = doc(db, 'students', studentId);
    await deleteDoc(studentDoc);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

/**
 * Get pending students for an institution
 */
export const getPendingStudents = async (institutionId: string): Promise<Student[]> => {
  try {
    const studentsCollection = collection(db, 'students');
    const q = query(
      studentsCollection, 
      where('institution_id', '==', institutionId),
      where('status', '==', 'Pending')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      student_id: doc.id,
      ...doc.data()
    } as Student));
  } catch (error) {
    console.error('Error getting pending students:', error);
    throw error;
  }
};

/**
 * Approve a student
 */
export const approveStudent = async (studentId: string): Promise<void> => {
  try {
    const studentDoc = doc(db, 'students', studentId);
    await updateDoc(studentDoc, {
      status: 'Active',
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error approving student:', error);
    throw error;
  }
};

/**
 * Reject a student
 */
export const rejectStudent = async (studentId: string): Promise<void> => {
  try {
    const studentDoc = doc(db, 'students', studentId);
    await updateDoc(studentDoc, {
      status: 'Rejected',
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error rejecting student:', error);
    throw error;
  }
};
