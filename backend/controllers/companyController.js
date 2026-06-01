const { validationResult } = require('express-validator');
const { pool } = require('../config/db');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [companies] = await pool.query(
      'SELECT company_id, company_name, website, location, industry, description, created_at, updated_at FROM companies WHERE user_id = ?',
      [userId]
    );

    if (companies.length === 0) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    return res.json({ success: true, company: companies[0] });
  } catch (error) {
    return next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [companies] = await pool.query(
      'SELECT company_id, company_name, website, location, industry, description, created_at, updated_at FROM companies WHERE user_id = ?',
      [userId]
    );

    if (companies.length === 0) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    const company = companies[0];
    const [jobs] = await pool.query(
      `SELECT
         j.job_id,
         j.title,
         j.description,
         j.package_lpa,
         j.location,
         j.min_cgpa,
         j.last_date,
         j.is_active,
         j.created_at,
         COUNT(DISTINCT a.application_id) AS applicant_count,
         COALESCE(SUM(CASE WHEN a.status IN ('shortlisted', 'interview_scheduled', 'selected') THEN 1 ELSE 0 END), 0) AS shortlisted_count
       FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.job_id
       WHERE j.company_id = ?
       GROUP BY j.job_id, j.title, j.description, j.package_lpa, j.location, j.min_cgpa, j.last_date, j.is_active, j.created_at
       ORDER BY j.created_at DESC`,
      [company.company_id]
    );

    const [applicants] = await pool.query(
      `SELECT
         a.application_id,
         a.status,
         a.applied_at,
         j.job_id,
         j.title,
         s.student_id,
         s.name,
         s.roll_no,
         u.email,
         r.resume_path
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       JOIN students s ON a.student_id = s.student_id
       JOIN users u ON s.user_id = u.id
       LEFT JOIN resumes r ON r.student_id = s.student_id
       WHERE j.company_id = ?
       ORDER BY a.applied_at DESC`,
      [company.company_id]
    );

    const shortlistedStudents = applicants.filter((applicant) =>
      ['shortlisted', 'interview_scheduled', 'selected'].includes(applicant.status)
    );

    const activeJobs = jobs.filter((job) => Number(job.is_active) === 1);
    const applicantsCount = applicants.length;

    return res.json({
      success: true,
      company,
      stats: {
        activeJobs: activeJobs.length,
        applicants: applicantsCount,
        shortlistedStudents: shortlistedStudents.length
      },
      jobs,
      applicants,
      shortlistedStudents
    });
  } catch (error) {
    return next(error);
  }
};

const createJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const userId = req.user.id;
    const { title, description, package_lpa, location, min_cgpa, last_date } = req.body;

    const [companies] = await pool.query('SELECT company_id FROM companies WHERE user_id = ?', [userId]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company profile not found' });
    const companyId = companies[0].company_id;

    const [result] = await pool.query(
      `INSERT INTO jobs (company_id, title, description, package_lpa, location, min_cgpa, last_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [companyId, title, description, Number(package_lpa), location, Number(min_cgpa), last_date]
    );

    return res.status(201).json({ success: true, message: 'Job posted', jobId: result.insertId });
  } catch (error) {
    return next(error);
  }
};

const editJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const userId = req.user.id;
    const jobId = Number(req.params.jobId);
    const { title, description, package_lpa, location, min_cgpa, last_date, is_active } = req.body;

    const [companies] = await pool.query('SELECT company_id FROM companies WHERE user_id = ?', [userId]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company profile not found' });
    const companyId = companies[0].company_id;

    const [jobs] = await pool.query('SELECT company_id FROM jobs WHERE job_id = ?', [jobId]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    if (Number(jobs[0].company_id) !== Number(companyId)) return res.status(403).json({ success: false, message: 'Not authorized to edit this job' });

    await pool.query(
      `UPDATE jobs SET title = ?, description = ?, package_lpa = ?, location = ?, min_cgpa = ?, last_date = ?, is_active = ? WHERE job_id = ?`,
      [title, description, Number(package_lpa), location, Number(min_cgpa), last_date, is_active ? 1 : 0, jobId]
    );

    return res.json({ success: true, message: 'Job updated' });
  } catch (error) {
    return next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = Number(req.params.jobId);

    const [companies] = await pool.query('SELECT company_id FROM companies WHERE user_id = ?', [userId]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company profile not found' });
    const companyId = companies[0].company_id;

    const [jobs] = await pool.query('SELECT company_id FROM jobs WHERE job_id = ?', [jobId]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    if (Number(jobs[0].company_id) !== Number(companyId)) return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });

    await pool.query('DELETE FROM jobs WHERE job_id = ?', [jobId]);

    return res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    return next(error);
  }
};

const viewApplicants = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = Number(req.params.jobId);

    const [companies] = await pool.query('SELECT company_id FROM companies WHERE user_id = ?', [userId]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company profile not found' });
    const companyId = companies[0].company_id;

    const [jobs] = await pool.query('SELECT company_id FROM jobs WHERE job_id = ?', [jobId]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    if (Number(jobs[0].company_id) !== Number(companyId)) return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this job' });

    const [applicants] = await pool.query(
      `SELECT a.application_id, a.status, a.applied_at, s.student_id, s.name, s.roll_no, u.email, r.resume_path
       FROM applications a
       JOIN students s ON a.student_id = s.student_id
       JOIN users u ON s.user_id = u.id
       LEFT JOIN resumes r ON r.student_id = s.student_id
       WHERE a.job_id = ?
       ORDER BY a.applied_at DESC`,
      [jobId]
    );

    return res.json({ success: true, applicants });
  } catch (error) {
    return next(error);
  }
};

const shortlistStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const userId = req.user.id;
    const applicationId = Number(req.params.applicationId);
    const { status } = req.body; // expected: 'shortlisted' | 'rejected' | 'interview_scheduled' | 'selected'

    const [companies] = await pool.query('SELECT company_id FROM companies WHERE user_id = ?', [userId]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company profile not found' });
    const companyId = companies[0].company_id;

    const [applications] = await pool.query('SELECT application_id, job_id FROM applications WHERE application_id = ?', [applicationId]);
    if (applications.length === 0) return res.status(404).json({ success: false, message: 'Application not found' });

    const app = applications[0];
    const [jobs] = await pool.query('SELECT company_id FROM jobs WHERE job_id = ?', [app.job_id]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Related job not found' });
    if (Number(jobs[0].company_id) !== Number(companyId)) return res.status(403).json({ success: false, message: 'Not authorized to update this application' });

    await pool.query('UPDATE applications SET status = ? WHERE application_id = ?', [status, applicationId]);

    return res.json({ success: true, message: 'Application status updated' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  getDashboard,
  createJob,
  editJob,
  deleteJob,
  viewApplicants,
  shortlistStudent
};
