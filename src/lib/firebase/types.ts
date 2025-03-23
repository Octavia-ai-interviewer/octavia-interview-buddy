import { Timestamp } from 'firebase/firestore';

export interface Institution {
  institution_id: string;
  name: string;
  type: string;
  website: string;
  address: string;
  admin_name: string;
  admin_email: string;
  admin_phone: string;
  admin_title: string;
  subscription_plan: string;
  email_domains: string[];
  licenses: number;
  price_per_license: number;
  session_minutes: number;
  extra_minutes_rate: number;
  signup_link: string;
  platform_engagement: string;
  total_users: number;
  interviews_completed: number;
  average_session_time: number;
  engagement_rate: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Student {
  student_id: string;
  institution_id: string;
  full_name: string;
  email: string;
  status: 'Active' | 'Pending' | 'Rejected';
  resume_uploaded: boolean;
  linkedin_profile?: string;
  first_interview_completed: boolean;
  signup_date: Timestamp;
  last_activity: Timestamp;
  session_minutes: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Resume {
  resume_id: string;
  student_id: string;
  resume_data: string;
  upload_date: Timestamp;
  file_url?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Interview {
  interview_id: string;
  student_id: string;
  date: Timestamp;
  time: string;
  type: string;
  title: string;
  questions: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface InterviewResult {
  interview_result_id: string;
  interview_id: string;
  student_id: string;
  score: number;
  feedback: string;
  feedback_categories: {
    [key: string]: number;
  };
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Job {
  job_id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  job_board_source?: string;
  job_url?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface JobApplication {
  application_id: string;
  job_id: string;
  student_id: string;
  personal_information: string;
  resume: string;
  cover_letter?: string;
  linkedin_profile?: string;
  portfolio_website?: string;
  availability: string;
  application_date: Timestamp;
  status: string;
  applied_after_click?: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface PaymentMethod {
  payment_method_id: string;
  institution_id: string;
  type: string;
  last4: string;
  expiry: string;
  default_payment: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface BillingHistory {
  billing_history_id: string;
  institution_id: string;
  date: Timestamp;
  description: string;
  amount: number;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ContactInquiry {
  inquiry_id: string;
  institution_name: string;
  contact_name: string;
  email: string;
  phone: string;
  student_capacity: string;
  message: string;
  submission_date: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Message {
  message_id: string;
  title: string;
  type: string;
  target: string;
  content: string;
  status: string;
  date: Timestamp;
  delivery_rate: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ResumeView {
  resume_id: string;
  view_date: Timestamp;
  time_spent: string;
  sections_engaged: string[];
  clicks: string[];
  scroll_percentage: string;
  ip_address: string;
  location: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ResumeAnalytics {
  student_id: string;
  student_name: string;
  resume_views: number;
  time_on_sections: Record<string, string>;
  contact_clicks: number;
  downloads: number;
  improvement_score: number;
  ai_usage: number;
  resumes_generated: number;
  job_matches: number;
  job_click_rate: string;
}

export interface InterviewAnalytics {
  student_id: string;
  student_name: string;
  response_quality: number;
  common_mistakes: string[];
  avg_response_time: string;
  sentiment: string;
  keyword_usage: string;
  practice_attempts: number;
  topic_performance: Record<string, number>;
  feedback_engagement: string;
  improvement_trajectory: string;
  benchmark_percentile: string;
  difficulty_tolerance: string;
  confidence_level: string;
  improvement_score: number;
  drop_off_rate: string;
}
