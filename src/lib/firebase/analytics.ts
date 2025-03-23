import { 
  collection, 
  query, 
  where, 
  getDocs,
  limit,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { db } from './config';
import { ResumeAnalytics, InterviewAnalytics } from './types';

/**
 * Get resume analytics data
 * Note: This data is coming from another Firebase project and is being accessed through this interface
 */
export const getResumeAnalytics = async (studentId?: string, departmentId?: string): Promise<ResumeAnalytics[]> => {
  try {
    const resumeAnalyticsCollection = collection(db, 'resume_analytics');
    let q: any = resumeAnalyticsCollection;
    
    if (studentId && departmentId) {
      q = query(
        resumeAnalyticsCollection,
        where('student_id', '==', studentId),
        where('department_id', '==', departmentId)
      );
    } else if (studentId) {
      q = query(resumeAnalyticsCollection, where('student_id', '==', studentId));
    } else if (departmentId) {
      q = query(resumeAnalyticsCollection, where('department_id', '==', departmentId));
    }
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('No resume analytics found');
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return data as ResumeAnalytics;
    });
  } catch (error) {
    console.error('Error getting resume analytics:', error);
    throw error;
  }
};

/**
 * Get interview analytics data
 */
export const getInterviewAnalytics = async (studentId?: string, departmentId?: string): Promise<InterviewAnalytics[]> => {
  try {
    const interviewAnalyticsCollection = collection(db, 'interview_analytics');
    let q: any = interviewAnalyticsCollection;
    
    if (studentId && departmentId) {
      q = query(
        interviewAnalyticsCollection,
        where('student_id', '==', studentId),
        where('department_id', '==', departmentId)
      );
    } else if (studentId) {
      q = query(interviewAnalyticsCollection, where('student_id', '==', studentId));
    } else if (departmentId) {
      q = query(interviewAnalyticsCollection, where('department_id', '==', departmentId));
    }
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('No interview analytics found');
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return data as InterviewAnalytics;
    });
  } catch (error) {
    console.error('Error getting interview analytics:', error);
    throw error;
  }
};

/**
 * Get department performance metrics
 */
export const getDepartmentPerformance = async (): Promise<{ name: string; avgScore: number }[]> => {
  try {
    const departmentPerformanceCollection = collection(db, 'department_performance');
    const snapshot = await getDocs(departmentPerformanceCollection);
    
    if (snapshot.empty) {
      console.log('No department performance data found');
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      name: doc.id,
      avgScore: doc.data().avgScore || 0
    }));
  } catch (error) {
    console.error('Error getting department performance:', error);
    throw error;
  }
};

/**
 * Get platform engagement metrics
 */
export const getPlatformEngagement = async (): Promise<{
  resumeInterviewCorrelation: string;
  mostUsedFeatures: string[];
  licenseActivationRate: string;
  studentsAtRisk: number;
}> => {
  try {
    const platformEngagementDoc = collection(db, 'platform_metrics');
    const snapshot = await getDocs(platformEngagementDoc);
    
    if (snapshot.empty) {
      console.log('No platform engagement data found');
      return {
        resumeInterviewCorrelation: '0%',
        mostUsedFeatures: [],
        licenseActivationRate: '0%',
        studentsAtRisk: 0
      };
    }
    
    // Assuming there's only one document with platform metrics
    const data = snapshot.docs[0].data();
    
    return {
      resumeInterviewCorrelation: data.resumeInterviewCorrelation || '0%',
      mostUsedFeatures: data.mostUsedFeatures || [],
      licenseActivationRate: data.licenseActivationRate || '0%',
      studentsAtRisk: data.studentsAtRisk || 0
    };
  } catch (error) {
    console.error('Error getting platform engagement:', error);
    throw error;
  }
};

/**
 * Get resume views analytics
 */
export const getResumeViews = async (resumeId: string): Promise<any[]> => {
  try {
    const viewsCollection = collection(db, 'employer_resume_views');
    const q = query(
      viewsCollection, 
      where('resume_id', '==', resumeId),
      orderBy('view_date', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('No resume views found');
      return [];
    }
    
    return snapshot.docs.map(doc => {
      return doc.data();
    });
  } catch (error) {
    console.error('Error getting resume views:', error);
    throw error;
  }
};

/**
 * Record a resume view
 */
export const recordResumeView = async (
  resumeId: string,
  timeSpent: string,
  sectionsEngaged: string[],
  clicks: string[],
  scrollPercentage: string,
  ipAddress: string,
  location: string
): Promise<void> => {
  try {
    const viewsCollection = collection(db, 'employer_resume_views');
    await addDoc(viewsCollection, {
      resume_id: resumeId,
      view_date: new Date(),
      time_spent: timeSpent,
      sections_engaged: sectionsEngaged,
      clicks: clicks,
      scroll_percentage: scrollPercentage,
      ip_address: ipAddress,
      location: location
    });
  } catch (error) {
    console.error('Error recording resume view:', error);
    throw error;
  }
};
