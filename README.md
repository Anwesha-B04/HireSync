# 🚀 HireSync: Campus Placement Management System

HireSync is a modern, full-stack campus placement management system designed to streamline and digitize recruitment operations. It provides dedicated portals and automated workflows for three roles: **Students**, **Recruiters (Companies)**, and **Placement Officers (Admins)**.

---

## 🛠️ Tech Stack

| Layer | Technology | Key Libraries |
| :--- | :--- | :--- |
| **Frontend** | React.js | Vite, React Router DOM, Axios, Tailwind CSS, React Hook Form |
| **Backend** | Node.js, Express.js | Multer (uploads), JWT, bcryptjs, express-validator, Helmet |
| **Database** | MySQL | mysql2 (Pool connection management) |
| **Hosting** | Netlify (Frontend) | Railway (Backend & MySQL Database) |

---

## 🔑 Core Roles & Features

### 1. 🎓 Student Portal
* **Profile Management**: Build academic profile details (GPA, course, department, passing year, skills).
* **Resume Versioning**: Upload and view multiple PDF resume versions with dynamic download capability.
* **Job Portal**: Search and filter job listings by minimum CGPA, salary package, company location, and required skills.
* **Application Tracker**: Apply for drives, track applications through stages (`Applied`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`), or withdraw.
* **Interview Timeline**: View scheduled interview rounds, dates, and final selection statuses with notifications.

### 2. 🏢 Recruiter (Company) Portal
* **Approval Flow**: Self-registers as a company. Starts as `Pending` and cannot log in until approved by the Admin.
* **Job Listings**: Create, edit, close, and delete job postings with eligibility criteria.
* **Applicant Actions**: Shortlist, reject, download applicant CVs, or schedule interview rounds.
* **Interview Recorder**: Set up multiple rounds (e.g., Technical, HR) and mark candidates as `Passed`, `Failed`, or `Selected`.

### 3. 💼 Placement Officer (Admin) Portal
* **Dashboard Analytics**: Real-time counter metrics tracking total students, active companies, posted jobs, and successful placements.
* **Corporate Approvals**: Approve or reject newly registered recruiter accounts.
* **Placement Drive Coordinator**: Announce upcoming offline/online placement drives (dates, venue, details).
* **Export Reports**: Generate and export CSV files for Students lists, Company metrics, and Placement logs.

---

## 📂 Project Structure

```text
HireSync/
├── database/
│   ├── schema.sql           # Database table structures (Users, Students, Placements, etc.)
│   ├── seed.sql             # Base database records (Admin login, core skills list)
│   └── seed_jobs.sql        # Demo placement drives and mock recruiter listings
├── backend/
│   ├── config/              # Database pool connectors
│   ├── controllers/         # Request handling logic (Auth, Students, Admin, Recruiter)
│   ├── middleware/          # JWT protection, role authorizations, CORS handlers
│   ├── routes/              # Express Router mapping (/api/auth, /api/students, etc.)
│   ├── uploads/             # Stores uploaded PDFs locally in development
│   ├── server.js            # Entry point (auto-migration check & static file serving)
│   └── .env                 # Backend environment variables
└── frontend/
    ├── public/              # Static assets & icons
    ├── src/
    │   ├── components/      # Common UI wrappers (Cards, Headers, Loaders)
    │   ├── context/         # Auth & Session state provider
    │   ├── pages/           # Pages divided by portal roles
    │   ├── services/        # Axios API clients
    │   ├── utils/           # Shared helper formatters
    │   └── App.jsx          # Route declarations
    └── .env                 # Frontend environment variables
```

---

## ⚙️ Local Development Setup

### Prerequisites
* **Node.js** (v18+)
* **MySQL Server** (v8.0+)

### 1. Database Setup
1. Open your MySQL client (Workbench or CLI) and run:
   ```sql
   CREATE DATABASE hiresync;
   ```
2. Import the schema to build the tables:
   ```bash
   mysql -u YOUR_USER -p hiresync < database/schema.sql
   ```
3. Seed the initial admin account and default skills list:
   ```bash
   mysql -u YOUR_USER -p hiresync < database/seed.sql
   ```

### 2. Backend Installation & Config
1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` folder and add:
   ```env
   PORT=5001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=YOUR_MYSQL_USER
   DB_PASSWORD=YOUR_MYSQL_PASSWORD
   DB_NAME=hiresync
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5001` and check/migrate database columns on start.*

### 3. Frontend Installation & Config
1. Open a new terminal window, navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file in the `frontend/` folder and add:
   ```env
   VITE_API_URL=http://localhost:5001
   ```
3. Start the Vite development build:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 🚀 Production Deployment Guide

### 1. Database & Backend (Railway)
1. **Database**: Spin up a **MySQL** instance on Railway and import the `database/schema.sql` and `database/seed.sql` files.
2. **Backend**: Link your repository to Railway and set the root directory to `backend/`. Add the following environment variables in the Railway dashboard:
   * `PORT`: `5000` (or leave empty for Railway default)
   * `NODE_ENV`: `production`
   * `DB_HOST`: *Your Railway MySQL Host*
   * `DB_PORT`: *Your Railway MySQL Port*
   * `DB_USER`: *Your Railway MySQL Username*
   * `DB_PASSWORD`: *Your Railway MySQL Password*
   * `DB_NAME`: *Your Railway MySQL Database Name*
   * `CORS_ORIGIN`: *Your Netlify Frontend URL (e.g. `https://hiresyncx.netlify.app`)*
   * `JWT_SECRET`: *A secure random string*

### 2. Frontend (Netlify)
1. Connect the repository and configure the build settings on Netlify:
   * **Base directory**: `frontend`
   * **Build command**: `npm run build`
   * **Publish directory**: `frontend/dist`
2. Add the following environment variable in the Netlify settings:
   * `VITE_API_URL`: *Your Railway Backend URL (e.g., `https://hiresync-production.up.railway.app`)*
3. **Redirect configuration (for SPA routing)**: Create a file named `_redirects` inside `frontend/public/` with the following content to prevent 404 errors on refreshing pages:
   ```text
   /*    /index.html   200
   ```

---

## 📋 API Routes Reference

### Authentication
* `POST /api/auth/register` — Create new student/company login
* `POST /api/auth/login` — Sign in and receive JWT token
* `POST /api/auth/forgot-password` — Request a recovery code
* `POST /api/auth/reset-password` — Reset password using the code

### Student
* `GET /api/students/profile` — Get logged-in student's details
* `PUT /api/students/profile` — Update student profile fields
* `POST /api/students/resume` — Upload a new resume PDF (Multer)
* `GET /api/students/applications` — Get job applications log
* `POST /api/students/apply` — Apply to a job listing

### Company
* `GET /api/companies/jobs` — Retrieve recruiter's active jobs
* `POST /api/companies/jobs` — Create a new job listing
* `GET /api/companies/applicants` — Retrieve applicants details
* `POST /api/companies/interviews` — Schedule an interview round

### Admin
* `GET /api/admin/students` — View student database
* `GET /api/admin/companies` — View company accounts for approval
* `PUT /api/admin/companies/:id/status` — Approve or reject company status
* `GET /api/admin/reports` — Fetch statistical placement logs for download
