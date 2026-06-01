const { validationResult } = require('express-validator');
const { pool } = require('../config/db');

const listStudents = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.query('SELECT SQL_CALC_FOUND_ROWS s.student_id, s.roll_no, s.name, s.phone, s.department, s.course, s.cgpa, s.passing_year, u.email FROM students s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC LIMIT ? OFFSET ?', [pageSize, offset]);
    const [countRes] = await pool.query('SELECT FOUND_ROWS() as total');
    const total = countRes[0] ? Number(countRes[0].total) : rows.length;

    return res.json({ success: true, total, page, pageSize, students: rows });
  } catch (error) {
    return next(error);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const studentId = Number(req.params.studentId);
    const [students] = await pool.query('SELECT s.*, u.email FROM students s JOIN users u ON s.user_id = u.id WHERE s.student_id = ?', [studentId]);
    if (students.length === 0) return res.status(404).json({ success: false, message: 'Student not found' });
    const student = students[0];

    const [skills] = await pool.query('SELECT sk.skill_name FROM skills sk JOIN student_skills ss ON sk.skill_id = ss.skill_id WHERE ss.student_id = ?', [studentId]);
    const [resumes] = await pool.query('SELECT resume_id, resume_path, upload_date FROM resumes WHERE student_id = ? ORDER BY upload_date DESC', [studentId]);

    return res.json({ success: true, student: { ...student, skills: skills.map(s => s.skill_name), resumes } });
  } catch (error) {
    return next(error);
  }
};

const updateStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const studentId = Number(req.params.studentId);
    const { name, phone, department, course, cgpa, passing_year } = req.body;

    const [students] = await pool.query('SELECT student_id FROM students WHERE student_id = ?', [studentId]);
    if (students.length === 0) return res.status(404).json({ success: false, message: 'Student not found' });

    await pool.query('UPDATE students SET name = COALESCE(?, name), phone = COALESCE(?, phone), department = COALESCE(?, department), course = COALESCE(?, course), cgpa = COALESCE(?, cgpa), passing_year = COALESCE(?, passing_year) WHERE student_id = ?', [name || null, phone || null, department || null, course || null, cgpa ? Number(cgpa) : null, passing_year ? Number(passing_year) : null, studentId]);

    return res.json({ success: true, message: 'Student updated' });
  } catch (error) {
    return next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const studentId = Number(req.params.studentId);
    const [rows] = await pool.query('SELECT user_id FROM students WHERE student_id = ?', [studentId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Student not found' });
    const userId = rows[0].user_id;

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    return res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    return next(error);
  }
};

// Companies
const listCompanies = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.query('SELECT SQL_CALC_FOUND_ROWS c.company_id, c.company_name, c.website, c.location, c.industry, c.description, u.email FROM companies c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC LIMIT ? OFFSET ?', [pageSize, offset]);
    const [countRes] = await pool.query('SELECT FOUND_ROWS() as total');
    const total = countRes[0] ? Number(countRes[0].total) : rows.length;

    return res.json({ success: true, total, page, pageSize, companies: rows });
  } catch (error) {
    return next(error);
  }
};

const getCompany = async (req, res, next) => {
  try {
    const companyId = Number(req.params.companyId);
    const [companies] = await pool.query('SELECT c.*, u.email FROM companies c JOIN users u ON c.user_id = u.id WHERE c.company_id = ?', [companyId]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company not found' });
    return res.json({ success: true, company: companies[0] });
  } catch (error) {
    return next(error);
  }
};

const updateCompany = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const companyId = Number(req.params.companyId);
    const { company_name, website, location, industry, description } = req.body;

    const [companies] = await pool.query('SELECT company_id FROM companies WHERE company_id = ?', [companyId]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company not found' });

    await pool.query('UPDATE companies SET company_name = COALESCE(?, company_name), website = COALESCE(?, website), location = COALESCE(?, location), industry = COALESCE(?, industry), description = COALESCE(?, description) WHERE company_id = ?', [company_name || null, website || null, location || null, industry || null, description || null, companyId]);

    return res.json({ success: true, message: 'Company updated' });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Company name already exists' });
    return next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const companyId = Number(req.params.companyId);
    const [rows] = await pool.query('SELECT user_id FROM companies WHERE company_id = ?', [companyId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Company not found' });
    const userId = rows[0].user_id;

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    return res.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    return next(error);
  }
};

// Jobs
const listJobs = async (req, res, next) => {
  try {
    const [jobs] = await pool.query('SELECT j.job_id, j.title, j.description, j.package_lpa, j.location, j.min_cgpa, j.last_date, j.is_active, c.company_id, c.company_name FROM jobs j JOIN companies c ON j.company_id = c.company_id ORDER BY j.created_at DESC');
    return res.json({ success: true, jobs });
  } catch (error) {
    return next(error);
  }
};

const getJob = async (req, res, next) => {
  try {
    const jobId = Number(req.params.jobId);
    const [jobs] = await pool.query('SELECT j.*, c.company_id, c.company_name FROM jobs j JOIN companies c ON j.company_id = c.company_id WHERE j.job_id = ?', [jobId]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    return res.json({ success: true, job: jobs[0] });
  } catch (error) {
    return next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const jobId = Number(req.params.jobId);
    const [jobs] = await pool.query('SELECT job_id FROM jobs WHERE job_id = ?', [jobId]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });

    await pool.query('DELETE FROM jobs WHERE job_id = ?', [jobId]);
    return res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    return next(error);
  }
};

// Placement drives
const listDrives = async (req, res, next) => {
  try {
    const [drives] = await pool.query('SELECT pd.drive_id, pd.drive_date, pd.venue, pd.description, c.company_id, c.company_name FROM placement_drives pd JOIN companies c ON pd.company_id = c.company_id ORDER BY pd.drive_date DESC');
    return res.json({ success: true, drives });
  } catch (error) {
    return next(error);
  }
};

const createDrive = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { company_id, drive_date, venue, description } = req.body;
    const [companies] = await pool.query('SELECT company_id FROM companies WHERE company_id = ?', [company_id]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company not found' });

    const [result] = await pool.query('INSERT INTO placement_drives (company_id, drive_date, venue, description) VALUES (?, ?, ?, ?)', [company_id, drive_date, venue, description || null]);
    return res.status(201).json({ success: true, message: 'Drive created', driveId: result.insertId });
  } catch (error) {
    return next(error);
  }
};

const updateDrive = async (req, res, next) => {
  try {
    const driveId = Number(req.params.driveId);
    const { company_id, drive_date, venue, description } = req.body;

    const [drives] = await pool.query('SELECT drive_id FROM placement_drives WHERE drive_id = ?', [driveId]);
    if (drives.length === 0) return res.status(404).json({ success: false, message: 'Drive not found' });

    await pool.query('UPDATE placement_drives SET company_id = COALESCE(?, company_id), drive_date = COALESCE(?, drive_date), venue = COALESCE(?, venue), description = COALESCE(?, description) WHERE drive_id = ?', [company_id || null, drive_date || null, venue || null, description || null, driveId]);

    return res.json({ success: true, message: 'Drive updated' });
  } catch (error) {
    return next(error);
  }
};

const deleteDrive = async (req, res, next) => {
  try {
    const driveId = Number(req.params.driveId);
    const [drives] = await pool.query('SELECT drive_id FROM placement_drives WHERE drive_id = ?', [driveId]);
    if (drives.length === 0) return res.status(404).json({ success: false, message: 'Drive not found' });

    await pool.query('DELETE FROM placement_drives WHERE drive_id = ?', [driveId]);
    return res.json({ success: true, message: 'Drive deleted' });
  } catch (error) {
    return next(error);
  }
};

// Reports
const summaryReport = async (req, res, next) => {
  try {
    const [[{ students_count }]] = await pool.query('SELECT COUNT(*) as students_count FROM students');
    const [[{ companies_count }]] = await pool.query('SELECT COUNT(*) as companies_count FROM companies');
    const [[{ jobs_count }]] = await pool.query('SELECT COUNT(*) as jobs_count FROM jobs');
    const [[{ applications_count }]] = await pool.query('SELECT COUNT(*) as applications_count FROM applications');
    const [[{ placements_count }]] = await pool.query('SELECT COUNT(*) as placements_count FROM placements');

    return res.json({
      success: true,
      summary: {
        students: Number(students_count),
        companies: Number(companies_count),
        jobs: Number(jobs_count),
        applications: Number(applications_count),
        placements: Number(placements_count)
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  listCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  listJobs,
  getJob,
  deleteJob,
  listDrives,
  createDrive,
  updateDrive,
  deleteDrive,
  summaryReport
};
