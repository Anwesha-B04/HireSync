const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { pool } = require('../config/db');

const jwtSecret = process.env.JWT_SECRET || 'hire-sync-secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

const createToken = (user) => jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role
  },
  jwtSecret,
  { expiresIn: jwtExpiresIn }
);

const registerUser = (role) => async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const connection = await pool.getConnection();

  try {
    const {
      email,
      password,
      name,
      phone,
      department,
      course,
      cgpa,
      passingYear,
      rollNo,
      companyName,
      website,
      location,
      industry,
      description
    } = req.body;

    await connection.beginTransaction();

    const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    const userId = userResult.insertId;

    if (role === 'student') {
      await connection.query(
        `INSERT INTO students (user_id, roll_no, name, phone, department, course, cgpa, passing_year)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          rollNo,
          name,
          phone || null,
          department,
          course,
          Number(cgpa),
          Number(passingYear)
        ]
      );
    }

    if (role === 'company') {
      await connection.query(
        `INSERT INTO companies (user_id, company_name, website, location, industry, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          companyName,
          website || null,
          location,
          industry,
          description || null
        ]
      );
    }

    await connection.commit();

    const token = createToken({ id: userId, email, role });

    return res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      token,
      user: {
        id: userId,
        email,
        role
      }
    });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
};

const registerStudent = registerUser('student');
const registerCompany = registerUser('company');

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      'SELECT id, email, password, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = createToken(user);

    let profile = null;

    if (user.role === 'student') {
      const [students] = await pool.query(
        'SELECT student_id, roll_no, name, phone, department, course, cgpa, passing_year FROM students WHERE user_id = ?',
        [user.id]
      );
      profile = students[0] || null;
    }

    if (user.role === 'company') {
      const [companies] = await pool.query(
        'SELECT company_id, company_name, website, location, industry, description FROM companies WHERE user_id = ?',
        [user.id]
      );
      profile = companies[0] || null;
    }

    if (user.role === 'admin') {
      const [admins] = await pool.query(
        'SELECT admin_id, name FROM admins WHERE user_id = ?',
        [user.id]
      );
      profile = admins[0] || null;
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (_req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

module.exports = {
  registerStudent,
  registerCompany,
  login,
  logout,
  createToken
};