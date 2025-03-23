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
import { Job, JobApplication } from './types';

/**
 * Get all jobs
 */
export const getJobs = async (): Promise<Job[]> => {
  try {
    const jobsCollection = collection(db, 'jobs');
    const snapshot = await getDocs(jobsCollection);
    return snapshot.docs.map(doc => ({
      job_id: doc.id,
      ...doc.data()
    } as Job));
  } catch (error) {
    console.error('Error getting jobs:', error);
    throw error;
  }
};

/**
 * Get a specific job by ID
 */
export const getJob = async (jobId: string): Promise<Job | null> => {
  try {
    const jobDoc = doc(db, 'jobs', jobId);
    const snapshot = await getDoc(jobDoc);
    
    if (snapshot.exists()) {
      return {
        job_id: snapshot.id,
        ...snapshot.data()
      } as Job;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

/**
 * Create a new job
 */
export const createJob = async (job: Omit<Job, 'job_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const jobsCollection = collection(db, 'jobs');
    const docRef = await addDoc(jobsCollection, {
      ...job,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Update an existing job
 */
export const updateJob = async (jobId: string, job: Partial<Job>): Promise<void> => {
  try {
    const jobDoc = doc(db, 'jobs', jobId);
    await updateDoc(jobDoc, {
      ...job,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

/**
 * Delete a job
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    const jobDoc = doc(db, 'jobs', jobId);
    await deleteDoc(jobDoc);
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

/**
 * Get job applications, optionally filtered by student or job
 */
export const getJobApplications = async (studentId?: string, jobId?: string): Promise<JobApplication[]> => {
  try {
    const applicationsCollection = collection(db, 'job_applications');
    let q = applicationsCollection;
    
    if (studentId && jobId) {
      q = query(
        applicationsCollection, 
        where('student_id', '==', studentId),
        where('job_id', '==', jobId)
      );
    } else if (studentId) {
      q = query(applicationsCollection, where('student_id', '==', studentId));
    } else if (jobId) {
      q = query(applicationsCollection, where('job_id', '==', jobId));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      application_id: doc.id,
      ...doc.data()
    } as JobApplication));
  } catch (error) {
    console.error('Error getting job applications:', error);
    throw error;
  }
};

/**
 * Get a specific job application by ID
 */
export const getJobApplication = async (applicationId: string): Promise<JobApplication | null> => {
  try {
    const applicationDoc = doc(db, 'job_applications', applicationId);
    const snapshot = await getDoc(applicationDoc);
    
    if (snapshot.exists()) {
      return {
        application_id: snapshot.id,
        ...snapshot.data()
      } as JobApplication;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting job application:', error);
    throw error;
  }
};

/**
 * Apply for a job
 */
export const applyForJob = async (application: Omit<JobApplication, 'application_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const applicationsCollection = collection(db, 'job_applications');
    const docRef = await addDoc(applicationsCollection, {
      ...application,
      application_date: serverTimestamp(),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

/**
 * Update a job application
 */
export const updateJobApplication = async (applicationId: string, application: Partial<JobApplication>): Promise<void> => {
  try {
    const applicationDoc = doc(db, 'job_applications', applicationId);
    await updateDoc(applicationDoc, {
      ...application,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating job application:', error);
    throw error;
  }
};

/**
 * Search for jobs by keyword
 */
export const searchJobs = async (keyword: string): Promise<Job[]> => {
  try {
    // Note: This is a simplified implementation. In a real application, you would
    // use a more sophisticated search mechanism like Algolia or Elasticsearch.
    const jobsCollection = collection(db, 'jobs');
    const snapshot = await getDocs(jobsCollection);
    
    const jobs = snapshot.docs.map(doc => ({
      job_id: doc.id,
      ...doc.data()
    } as Job));
    
    // Simple client-side filtering
    return jobs.filter(job => 
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};
