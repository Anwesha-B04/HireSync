USE hiresync;

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO users (id, email, password, role, created_at) VALUES
	(1, 'admin@hiresync.edu', '$2b$10$adminseedhash0000000000000000000000000000000000000000000', 'admin', '2026-01-10 09:00:00'),
	(2, 'arjun.sharma@students.hiresync.edu', '$2b$10$studentseedhash000000000000000000000000000000000000000', 'student', '2026-01-11 10:00:00'),
	(3, 'meera.patel@students.hiresync.edu', '$2b$10$studentseedhash111111111111111111111111111111111111111', 'student', '2026-01-11 10:05:00'),
	(4, 'kabir.singh@students.hiresync.edu', '$2b$10$studentseedhash222222222222222222222222222222222222222', 'student', '2026-01-11 10:10:00'),
	(5, 'sana.khan@students.hiresync.edu', '$2b$10$studentseedhash333333333333333333333333333333333333333', 'student', '2026-01-11 10:15:00'),
	(6, 'rithika.nair@students.hiresync.edu', '$2b$10$studentseedhash444444444444444444444444444444444444444', 'student', '2026-01-11 10:20:00'),
	(7, 'hr@techwave.com', '$2b$10$companyseedhash0000000000000000000000000000000000000000', 'company', '2026-01-12 09:00:00'),
	(8, 'careers@finaxis.io', '$2b$10$companyseedhash1111111111111111111111111111111111111111', 'company', '2026-01-12 09:10:00'),
	(9, 'jobs@cloudnest.ai', '$2b$10$companyseedhash2222222222222222222222222222222222222222', 'company', '2026-01-12 09:20:00');

INSERT INTO admins (admin_id, user_id, name, created_at, updated_at) VALUES
	(1, 1, 'Ananya Iyer', '2026-01-10 09:05:00', '2026-01-10 09:05:00');

INSERT INTO students (student_id, user_id, roll_no, name, phone, department, course, cgpa, passing_year, created_at, updated_at) VALUES
	(1, 2, 'CS2026-001', 'Arjun Sharma', '+91-9876500001', 'Computer Science', 'B.Tech CSE', 8.72, 2026, '2026-01-11 10:01:00', '2026-01-11 10:01:00'),
	(2, 3, 'IT2026-002', 'Meera Patel', '+91-9876500002', 'Information Technology', 'B.Tech IT', 8.94, 2026, '2026-01-11 10:06:00', '2026-01-11 10:06:00'),
	(3, 4, 'ECE2026-003', 'Kabir Singh', '+91-9876500003', 'Electronics', 'B.Tech ECE', 7.88, 2026, '2026-01-11 10:11:00', '2026-01-11 10:11:00'),
	(4, 5, 'MBA2026-004', 'Sana Khan', '+91-9876500004', 'Management', 'MBA', 8.21, 2026, '2026-01-11 10:16:00', '2026-01-11 10:16:00'),
	(5, 6, 'DS2026-005', 'Rithika Nair', '+91-9876500005', 'Data Science', 'B.Sc Data Science', 9.12, 2026, '2026-01-11 10:21:00', '2026-01-11 10:21:00');

INSERT INTO companies (company_id, user_id, company_name, website, location, industry, description, created_at, updated_at) VALUES
	(1, 7, 'TechWave Solutions Pvt Ltd', 'https://www.techwave.com', 'Bengaluru, India', 'Software Services', 'Product engineering and digital transformation company hiring for full-stack and backend roles.', '2026-01-12 09:01:00', '2026-01-12 09:01:00'),
	(2, 8, 'FinAxis Analytics', 'https://www.finaxis.io', 'Hyderabad, India', 'FinTech', 'Analytics-driven fintech platform focused on lending, risk, and payments.', '2026-01-12 09:11:00', '2026-01-12 09:11:00'),
	(3, 9, 'CloudNest AI', 'https://www.cloudnest.ai', 'Pune, India', 'Artificial Intelligence', 'AI infrastructure startup building cloud automation and intelligent developer tools.', '2026-01-12 09:21:00', '2026-01-12 09:21:00');

INSERT INTO resumes (resume_id, student_id, resume_path, upload_date) VALUES
	(1, 1, 'uploads/resumes/arjun_sharma_resume.pdf', '2026-02-01 11:00:00'),
	(2, 2, 'uploads/resumes/meera_patel_resume.pdf', '2026-02-01 11:05:00'),
	(3, 3, 'uploads/resumes/kabir_singh_resume.pdf', '2026-02-01 11:10:00'),
	(4, 4, 'uploads/resumes/sana_khan_resume.pdf', '2026-02-01 11:15:00'),
	(5, 5, 'uploads/resumes/rithika_nair_resume.pdf', '2026-02-01 11:20:00');

INSERT INTO skills (skill_id, skill_name) VALUES
	(1, 'JavaScript'),
	(2, 'React.js'),
	(3, 'Node.js'),
	(4, 'Express.js'),
	(5, 'MySQL'),
	(6, 'Java'),
	(7, 'Python'),
	(8, 'Data Analysis'),
	(9, 'Communication'),
	(10, 'Problem Solving');

INSERT INTO student_skills (student_id, skill_id) VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(2, 1),
	(2, 2),
	(2, 5),
	(3, 6),
	(3, 4),
	(3, 10),
	(4, 8),
	(4, 9),
	(4, 10),
	(5, 7),
	(5, 8),
	(5, 2);

-- last_date must be >= application date (CURDATE()) for GET /api/students/jobs
INSERT INTO jobs (job_id, company_id, title, description, package_lpa, location, min_cgpa, last_date, is_active, created_at, updated_at) VALUES
	(1, 1, 'Backend Developer', 'Develop REST APIs, integrate MySQL databases, and support deployment pipelines.', 8.50, 'Bengaluru, India', 7.50, '2026-09-20', TRUE, '2026-02-15 09:00:00', '2026-02-15 09:00:00'),
	(2, 1, 'Frontend Developer', 'Build responsive React interfaces and collaborate with UI/UX and backend teams.', 7.20, 'Bengaluru, India', 7.00, '2026-09-22', TRUE, '2026-02-15 09:05:00', '2026-02-15 09:05:00'),
	(3, 2, 'Data Analyst', 'Work on business reporting, dashboards, and SQL-driven analytics workflows.', 6.80, 'Hyderabad, India', 7.80, '2026-09-25', TRUE, '2026-02-16 10:00:00', '2026-02-16 10:00:00'),
	(4, 2, 'Business Analyst Intern', 'Support product and operations teams with process analysis and stakeholder reporting.', 4.80, 'Hyderabad, India', 7.20, '2026-09-26', TRUE, '2026-02-16 10:05:00', '2026-02-16 10:05:00'),
	(5, 2, 'ML Engineer', 'Train and deploy machine learning models with Python and cloud tooling.', 12.00, 'Pune, India', 8.50, '2026-09-28', TRUE, '2026-02-17 11:00:00', '2026-02-17 11:00:00');

INSERT INTO placement_drives (drive_id, company_id, drive_date, venue, description, created_at, updated_at) VALUES
	(1, 1, '2026-04-05', 'HireSync Auditorium, Bengaluru', 'Campus drive for software engineering and web development roles.', '2026-03-01 09:00:00', '2026-03-01 09:00:00'),
	(2, 2, '2026-04-08', 'Virtual Interview Room', 'Drive focused on analytics and business roles.', '2026-03-02 09:00:00', '2026-03-02 09:00:00'),
	(3, 3, '2026-04-12', 'Placement Hall, Pune', 'AI and machine learning recruitment drive.', '2026-03-03 09:00:00', '2026-03-03 09:00:00');

INSERT INTO applications (application_id, student_id, job_id, status, applied_at, updated_at) VALUES
	(1, 1, 1, 'shortlisted', '2026-03-02 10:00:00', '2026-03-05 14:00:00'),
	(2, 1, 2, 'applied', '2026-03-02 10:15:00', '2026-03-02 10:15:00'),
	(3, 2, 2, 'interview_scheduled', '2026-03-03 11:00:00', '2026-03-06 12:00:00'),
	(4, 2, 3, 'shortlisted', '2026-03-03 11:10:00', '2026-03-07 15:00:00'),
	(5, 3, 1, 'rejected', '2026-03-04 09:30:00', '2026-03-08 16:00:00'),
	(6, 3, 4, 'applied', '2026-03-04 09:45:00', '2026-03-04 09:45:00'),
	(7, 4, 3, 'interview_scheduled', '2026-03-05 12:00:00', '2026-03-09 13:00:00'),
	(8, 4, 4, 'applied', '2026-03-05 12:15:00', '2026-03-05 12:15:00'),
	(9, 5, 5, 'applied', '2026-03-06 13:00:00', '2026-03-06 13:00:00'),
	(10, 5, 3, 'shortlisted', '2026-03-06 13:20:00', '2026-03-10 10:30:00');

INSERT INTO interviews (interview_id, application_id, round_name, interview_date, result, created_at, updated_at) VALUES
	(1, 1, 'Technical Round', '2026-04-05 10:00:00', 'passed', '2026-03-10 09:00:00', '2026-04-05 12:00:00'),
	(2, 3, 'Coding Round', '2026-04-06 11:00:00', 'pending', '2026-03-11 09:00:00', '2026-03-11 09:00:00'),
	(3, 4, 'Case Discussion', '2026-04-07 14:00:00', 'selected', '2026-03-12 09:00:00', '2026-04-07 16:00:00'),
	(4, 7, 'Technical Round', '2026-04-08 10:30:00', 'pending', '2026-03-13 09:00:00', '2026-03-13 09:00:00'),
	(5, 10, 'AI Screening', '2026-04-12 15:00:00', 'pending', '2026-03-14 09:00:00', '2026-03-14 09:00:00');

INSERT INTO notifications (notification_id, user_id, message, is_read, created_at) VALUES
	(1, 2, 'Your application for Backend Developer has been shortlisted.', FALSE, '2026-03-05 14:15:00'),
	(2, 3, 'Interview scheduled for Frontend Developer on 6 April 2026.', FALSE, '2026-03-06 12:05:00'),
	(3, 4, 'Your profile matches the Data Analyst role requirements.', TRUE, '2026-03-07 15:10:00'),
	(4, 5, 'New placement drive announced by TechWave Solutions Pvt Ltd.', FALSE, '2026-03-08 09:30:00'),
	(5, 1, 'Two new job applications are awaiting review.', FALSE, '2026-03-08 10:00:00');
    
INSERT INTO placement_drives
(
    company_id,
    drive_date,
    venue,
    description
)
VALUES
(
    1,
    '2026-09-05',
    'HireSync Auditorium, Bengaluru',
    'Campus drive for software engineering and web development roles.'
),
(
    2,
    '2026-09-08',
    'Virtual Interview Room',
    'Drive focused on analytics and business roles.'
),
(
    3,
    '2026-09-12',
    'Placement Hall, Pune',
    'AI and machine learning recruitment drive.'
);

SET FOREIGN_KEY_CHECKS = 1;





