-- institutions table
CREATE TABLE institutions (
    institution_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255),
    website VARCHAR(255),
    address TEXT,
    admin_name VARCHAR(255),
    admin_email VARCHAR(255),
    admin_phone VARCHAR(255),
    admin_title VARCHAR(255),
    subscription_plan VARCHAR(255),
    email_domains TEXT,
    licenses INT,
    price_per_license DECIMAL(10, 2),
    session_minutes INT,
    extra_minutes_rate DECIMAL(10, 2),
    signup_link TEXT,
    platform_engagement TEXT,
    total_users INT,
    interviews_completed INT,
    average_session_time DECIMAL(10, 2),
    engagement_rate DECIMAL(10, 2)
);

-- students table
CREATE TABLE students (
    student_id VARCHAR(255) PRIMARY KEY,
    institution_id VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    status VARCHAR(255),
    resume_uploaded BOOLEAN,
    linkedin_profile TEXT,
    first_interview_completed BOOLEAN,
    signup_date VARCHAR(255),
    last_activity VARCHAR(255),
    session_minutes INT,
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id)
);

-- resumes table
CREATE TABLE resumes (
    resume_id VARCHAR(255) PRIMARY KEY,
    student_id VARCHAR(255),
    resume_data TEXT,
    upload_date VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- interviews table
CREATE TABLE interviews (
    interview_id VARCHAR(255) PRIMARY KEY,
    student_id VARCHAR(255),
    date VARCHAR(255),
    time VARCHAR(255),
    type VARCHAR(255),
    title VARCHAR(255),
    questions TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- interview_results table
CREATE TABLE interview_results (
    interview_result_id VARCHAR(255) PRIMARY KEY,
    interview_id VARCHAR(255),
    student_id VARCHAR(255),
    score INT,
    feedback TEXT,
    feedback_categories TEXT,
    FOREIGN KEY (interview_id) REFERENCES interviews(interview_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- jobs table
CREATE TABLE jobs (
    job_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(255),
    salary VARCHAR(255),
    description TEXT
);

-- job_applications table
CREATE TABLE job_applications (
    application_id VARCHAR(255) PRIMARY KEY,
    job_id VARCHAR(255),
    student_id VARCHAR(255),
    personal_information TEXT,
    resume TEXT,
    cover_letter TEXT,
    linkedin_profile TEXT,
    portfolio_website TEXT,
    availability VARCHAR(255),
    application_date VARCHAR(255),
    status VARCHAR(255),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- payment_methods table
CREATE TABLE payment_methods (
    payment_method_id VARCHAR(255) PRIMARY KEY,
    institution_id VARCHAR(255),
    type VARCHAR(255),
    last4 VARCHAR(255),
    expiry VARCHAR(255),
    default_payment BOOLEAN,
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id)
);

-- billing_history table
CREATE TABLE billing_history (
    billing_history_id VARCHAR(255) PRIMARY KEY,
    institution_id VARCHAR(255),
    date VARCHAR(255),
    description TEXT,
    amount DECIMAL(10, 2),
    status VARCHAR(255),
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id)
);

-- contact_inquiries table
CREATE TABLE contact_inquiries (
    inquiry_id VARCHAR(255) PRIMARY KEY,
    institution_name VARCHAR(255),
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    student_capacity VARCHAR(255),
    message TEXT,
    submission_date VARCHAR(255)
);

-- messages table
CREATE TABLE messages (
    message_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    type VARCHAR(255),
    target VARCHAR(255),
    content TEXT,
    status VARCHAR(255),
    date VARCHAR(255),
    delivery_rate DECIMAL(5, 2)
);

-- employer_resume_views table
CREATE TABLE employer_resume_views (
    resume_id VARCHAR(255),
    view_date VARCHAR(255),
    time_spent VARCHAR(255),
    sections_engaged TEXT,
    clicks TEXT,
    scroll_percentage VARCHAR(255),
    ip_address VARCHAR(255),
    location VARCHAR(255),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- jobs table
ALTER TABLE jobs ADD COLUMN job_board_source VARCHAR(255);
ALTER TABLE jobs ADD COLUMN job_url TEXT;

-- job_applications table
ALTER TABLE job_applications ADD COLUMN applied_after_click BOOLEAN;
