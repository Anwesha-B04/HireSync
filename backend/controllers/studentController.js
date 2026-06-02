const { validationResult } = require('express-validator');
const { pool } = require('../config/db');
const path = require('path');
const fs = require('fs');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [students] = await pool.query(
  `SELECT
    s.student_id,
    s.roll_no,
    s.name,
    s.phone,
    s.department,
    s.course,
    s.cgpa,
    s.passing_year,
    u.email,
    s.created_at,
    s.updated_at
   FROM students s
   JOIN users u ON s.user_id = u.id
   WHERE s.user_id = ?`,
  [userId]
);

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const student = students[0];

    const [skills] = await pool.query(
  `SELECT
    s.skill_id,
    s.skill_name
   FROM skills s
   JOIN student_skills ss
   ON s.skill_id = ss.skill_id
   WHERE ss.student_id = ?`,
  [student.student_id]
);

    const [resumes] = await pool.query(
      'SELECT resume_id, resume_path, upload_date FROM resumes WHERE student_id = ? ORDER BY upload_date DESC',
      [student.student_id]
    );

    return res.json({
      success: true,
      student: {
        ...student,
        skills,
        resumes
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const { rollNo, name, phone, department, course, cgpa, passingYear } = req.body;

    const [students] = await pool.query('SELECT student_id FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const studentId = students[0].student_id;

    await pool.query(
      `UPDATE students SET roll_no = ?, name = ?, phone = ?, department = ?, course = ?, cgpa = ?, passing_year = ? WHERE student_id = ?`,
      [rollNo, name, phone || null, department, course, Number(cgpa), Number(passingYear), studentId]
    );

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Roll number already exists' });
    }
    return next(error);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const [students] = await pool.query('SELECT student_id FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) {
      // remove uploaded file
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const studentId = students[0].student_id;
    const relativePath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');

    const [result] = await pool.query(
      'INSERT INTO resumes (student_id, resume_path) VALUES (?, ?)',
      [studentId, relativePath]
    );

    return res.status(201).json({ success: true, message: 'Resume uploaded', resume: { id: result.insertId, path: relativePath } });
  } catch (error) {
    return next(error);
  }
};

const viewJobs = async (req, res, next) => {
  try {
    const [jobs] = await pool.query(
      `SELECT j.job_id, j.title, j.description, j.package_lpa, j.location, j.min_cgpa, j.last_date,
              j.is_active, c.company_id, c.company_name,
              (j.last_date >= CURDATE()) AS is_open_for_application
       FROM jobs j
       JOIN companies c ON j.company_id = c.company_id
       WHERE j.is_active = 1
       ORDER BY is_open_for_application DESC, j.created_at DESC`
    );

    return res.json({ success: true, jobs });
  } catch (error) {
    return next(error);
  }
};

const applyJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = Number(req.params.jobId);

    const [students] = await pool.query('SELECT student_id, cgpa FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const student = students[0];

    const [jobs] = await pool.query(
      'SELECT job_id, min_cgpa, is_active, (last_date >= CURDATE()) AS is_open_for_application FROM jobs WHERE job_id = ?',
      [jobId]
    );
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    const job = jobs[0];

    if (!job.is_active) return res.status(400).json({ success: false, message: 'Job is not active' });
    if (!job.is_open_for_application) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }
    if (Number(student.cgpa) < Number(job.min_cgpa)) {
      return res.status(400).json({ success: false, message: 'CGPA does not meet minimum requirement' });
    }

    const [existing] = await pool.query('SELECT application_id FROM applications WHERE student_id = ? AND job_id = ?', [student.student_id, jobId]);
    if (existing.length > 0) return res.status(409).json({ success: false, message: 'Already applied to this job' });

    const [result] = await pool.query('INSERT INTO applications (student_id, job_id) VALUES (?, ?)', [student.student_id, jobId]);

    return res.status(201).json({ success: true, message: 'Application submitted', applicationId: result.insertId });
  } catch (error) {
    return next(error);
  }
};

const viewApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [students] = await pool.query('SELECT student_id FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const studentId = students[0].student_id;

    const [applications] = await pool.query(
      `SELECT a.application_id, a.status, a.applied_at, j.job_id, j.title, j.package_lpa, j.location, c.company_id, c.company_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       JOIN companies c ON j.company_id = c.company_id
       WHERE a.student_id = ?
       ORDER BY a.applied_at DESC`,
      [studentId]
    );

    return res.json({ success: true, applications });
  } catch (error) {
    return next(error);
  }
};

const addSkill = async (req, res, next) => {
  try {
    const { skillName } = req.body;

    const [students] = await pool.query(
      'SELECT student_id FROM students WHERE user_id = ?',
      [req.user.id]
    );

    const studentId = students[0].student_id;

    let [skills] = await pool.query(
      'SELECT skill_id FROM skills WHERE skill_name = ?',
      [skillName]
    );

    let skillId;

    if (skills.length === 0) {
      const [result] = await pool.query(
        'INSERT INTO skills(skill_name) VALUES(?)',
        [skillName]
      );

      skillId = result.insertId;
    } else {
      skillId = skills[0].skill_id;
    }

    await pool.query(
      'INSERT IGNORE INTO student_skills(student_id, skill_id) VALUES (?, ?)',
      [studentId, skillId]
    );

    res.json({
      success: true,
      message: 'Skill added successfully'
    });
  } catch (error) {
    next(error);
  }
};

const removeSkill = async (req, res, next) => {
  try {
    const skillId = Number(req.params.skillId);

    const [students] = await pool.query(
      'SELECT student_id FROM students WHERE user_id = ?',
      [req.user.id]
    );

    const studentId = students[0].student_id;

    await pool.query(
      'DELETE FROM student_skills WHERE student_id = ? AND skill_id = ?',
      [studentId, skillId]
    );

    res.json({
      success: true,
      message: 'Skill removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  viewJobs,
  applyJob,
  viewApplications,
  addSkill,
  removeSkill
};
