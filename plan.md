# HireSync 

## Placement Management System

## Project Overview

Develop a full-stack Placement Management System that helps students, companies, and placement officers manage the complete campus placement process digitally.

The application should provide role-based access for Students, Companies, and Placement Officers (Admin).

The system should support:

* Student profile management
* Resume management
* Company management
* Job posting
* Placement drives
* Job applications
* Candidate shortlisting
* Interview scheduling
* Final placement tracking
* Analytics and reporting

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios

## Backend

* Node.js
* Express.js

## Database

* MySQL

## Development Tools

* MySQL Workbench
* VS Code
* Git

## Authentication

* JWT (JSON Web Token)
* bcrypt for password hashing

## File Uploads

* Multer
* Local Storage (for development)

---

# User Roles

## 1. Student

Students can:

* Register
* Login
* Manage profile
* Upload resume
* View placement drives
* View available jobs
* Apply for jobs
* Track application status
* View interview schedules
* View placement results

---

## 2. Company

Companies can:

* Register/Login
* Create company profile
* Post jobs
* Define eligibility criteria
* View applicants
* Shortlist candidates
* Schedule interviews
* Update candidate status
* Mark final selections

---

## 3. Placement Officer (Admin)

Admins can:

* Login
* Manage students
* Manage companies
* Manage jobs
* Manage placement drives
* View all applications
* View placement statistics
* Generate reports
* Approve company registrations

---

# Core Features

## Authentication Module

### Student Authentication

* Register
* Login
* Logout
* Forgot Password
* Reset Password

### Company Authentication

* Register
* Login
* Logout

### Admin Authentication

* Login
* Logout

---

# Student Module

## Student Profile

Store:

* Name
* Roll Number
* Email
* Phone
* Department
* Course
* CGPA
* Passing Year
* Skills
* Certifications

Features:

* Create profile
* Edit profile
* View profile

---

## Resume Management

Features:

* Upload resume PDF
* Replace resume
* Download resume
* View upload history

---

## Job Portal

Features:

* View all active jobs
* View company details
* Search jobs
* Filter jobs

Filters:

* Company
* Location
* Package
* Eligibility

---

## Job Applications

Features:

* Apply to jobs
* View applied jobs
* Withdraw application

Application Status:

* Applied
* Shortlisted
* Interview Scheduled
* Selected
* Rejected

---

## Interview Module

Features:

* View interview schedule
* View interview rounds
* View interview results

---

# Company Module

## Company Profile

Store:

* Company Name
* Website
* Location
* Industry
* Description

Features:

* Create profile
* Edit profile

---

## Job Management

Features:

* Create job posting
* Edit job posting
* Delete job posting
* Close job posting

Job Information:

* Job Title
* Description
* Package
* Location
* Minimum CGPA
* Required Skills
* Last Application Date

---

## Applicant Management

Features:

* View applicants
* Filter applicants
* Search applicants
* Download resumes

---

## Shortlisting

Features:

* Shortlist candidates
* Reject candidates
* Move candidates to interview rounds

---

## Interview Scheduling

Features:

* Schedule interviews
* Assign interview rounds
* Publish interview dates

---

## Selection Management

Features:

* Mark selected students
* Publish final results

---

# Admin Module

## Student Management

Features:

* View students
* Edit students
* Delete students
* View placement status

---

## Company Management

Features:

* Approve companies
* Reject companies
* Manage company accounts

---

## Placement Drive Management

Features:

* Create drive
* Update drive
* Delete drive

Drive Details:

* Company
* Date
* Venue
* Description

---

## Job Monitoring

Features:

* View all jobs
* View applications
* Track progress

---

## Reports

Generate:

* Student Reports
* Company Reports
* Placement Reports

Export:

* CSV
* Excel

---

# Bonus Features

## Dashboard Analytics

### Student Dashboard

Show:

* Total Applications
* Upcoming Interviews
* Placement Status

### Company Dashboard

Show:

* Active Jobs
* Applicants Count
* Selected Candidates

### Admin Dashboard

Show:

* Total Students
* Total Companies
* Total Jobs
* Total Placements

---

## Notification System

Notifications for:

* New Jobs
* Interview Scheduled
* Selection Status Updated
* Placement Drive Announcements

---

## Eligibility Checker

Automatically verify:

* CGPA
* Department
* Passing Year

before allowing job application.

---

## Search and Filtering

Search:

* Students
* Companies
* Jobs

Filter:

* Department
* Package
* Location
* Skills

---

## Placement Statistics

Generate:

* Placement Percentage
* Average Package
* Highest Package
* Department-wise Placements

---

## Activity Logs

Track:

* Login Activities
* Applications
* Job Updates
* Interview Updates

---

# Database Design

## Tables

### users

Purpose:

Store login information for all roles.

Columns:

* id
* email
* password
* role
* created_at

---

### students

Columns:

* student_id
* user_id
* roll_no
* name
* phone
* department
* course
* cgpa
* passing_year

---

### companies

Columns:

* company_id
* user_id
* company_name
* website
* location
* industry
* description

---

### admins

Columns:

* admin_id
* user_id
* name

---

### resumes

Columns:

* resume_id
* student_id
* resume_path
* upload_date

---

### skills

Columns:

* skill_id
* skill_name

---

### student_skills

Columns:

* student_id
* skill_id

---

### jobs

Columns:

* job_id
* company_id
* title
* description
* package_lpa
* location
* min_cgpa
* last_date

---

### placement_drives

Columns:

* drive_id
* company_id
* drive_date
* venue
* description

---

### applications

Columns:

* application_id
* student_id
* job_id
* status
* applied_at

---

### interviews

Columns:

* interview_id
* application_id
* round_name
* interview_date
* result

---

### placements

Columns:

* placement_id
* student_id
* company_id
* package_lpa
* joining_date

---

### notifications

Columns:

* notification_id
* user_id
* message
* is_read
* created_at

---

### activity_logs

Columns:

* log_id
* user_id
* action
* created_at

---

# API Structure

## Auth APIs

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/forgot-password

POST /api/auth/reset-password

---

## Student APIs

GET /api/students/profile

PUT /api/students/profile

POST /api/students/resume

GET /api/students/applications

POST /api/students/apply

---

## Company APIs

GET /api/company/jobs

POST /api/company/jobs

PUT /api/company/jobs/

DELETE /api/company/jobs/

GET /api/company/applicants

---

## Admin APIs

GET /api/admin/students

GET /api/admin/companies

GET /api/admin/reports

POST /api/admin/drives

---

# Folder Structure

HireSync/

frontend/

src/

components/

pages/

services/

hooks/

context/

layouts/

App.jsx

backend/

controllers/

routes/

middleware/

models/

config/

uploads/

server.js

database/

schema.sql

seed.sql

README.md

---

# Development Roadmap

## Phase 1 - Project Setup

Tasks:

1. Initialize frontend React application.
2. Configure Tailwind CSS.
3. Create backend Express application.
4. Configure MySQL connection.
5. Setup environment variables.
6. Create Git repository.

Deliverable:

Project skeleton ready.

---

## Phase 2 - Database Design

Tasks:

1. Create database.
2. Create tables.
3. Define primary keys.
4. Define foreign keys.
5. Insert sample data.

Deliverable:

Working database schema.

---

## Phase 3 - Backend Development

Tasks:

1. Configure Express.
2. Configure MySQL.
3. Create Models.
4. Create Controllers.
5. Create Routes.
6. Implement Authentication.
7. Implement JWT authorization.
8. Implement Role-based access control.

Deliverable:

Fully functional REST API.

---

## Phase 4 - Frontend Development

Tasks:

1. Create routing.
2. Create authentication pages.
3. Create dashboards.
4. Create forms.
5. Integrate APIs using Axios.
6. Add protected routes.

Deliverable:

Fully functional frontend.

---

## Phase 5 - Core Features

Tasks:

1. Student Profile Management.
2. Resume Upload.
3. Job Posting.
4. Job Applications.
5. Placement Drives.
6. Interview Scheduling.
7. Candidate Shortlisting.
8. Placement Tracking.

Deliverable:

Complete placement workflow.

---

## Phase 6 - Advanced Features

Tasks:

1. Notifications.
2. Search and Filters.
3. Dashboard Analytics.
4. Reports.
5. Placement Statistics.
6. Activity Logs.

Deliverable:

Production-level feature set.

---

## Phase 7 - Testing

Tasks:

1. API Testing.
2. Authentication Testing.
3. Database Testing.
4. UI Testing.
5. Role Permission Testing.

Deliverable:

Bug-free application.

---

## Phase 8 - Deployment

Frontend:

* Netlify

Backend:

* Render

Database:

* MySQL

Deliverable:

Live hosted application.

---

# Expected Outcome

Build a complete production-style Placement Management System (centralised) with:

* Role-based authentication
* Student management
* Company management
* Job posting and applications
* Placement drives
* Interview management
* Placement tracking
* Analytics dashboard
* Notifications
* Reporting system

The code should follow clean architecture, modular folder structure, reusable React components, RESTful API principles, secure authentication, and normalized MySQL database design.
