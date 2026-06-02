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
        `INSERT INTO companies (user_id, company_name, website, location, industry, description, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
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

    if (role === 'admin') {
      await connection.query(
        `INSERT INTO admins (user_id, name)
     VALUES (?, ?)`,
        [
          userId,
          name
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
const registerAdmin = registerUser('admin');

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
        'SELECT company_id, company_name, website, location, industry, description, status FROM companies WHERE user_id = ?',
        [user.id]
      );
      const company = companies[0];
      if (company) {
        if (company.status === 'pending') {
          return res.status(403).json({ success: false, message: 'Your company registration is pending admin approval' });
        }
        if (company.status === 'rejected') {
          return res.status(403).json({ success: false, message: 'Your company registration request has been rejected' });
        }
      }
      profile = company || null;
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

const resetTokens = {};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'No account associated with this email' });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetTokens[email] = {
      token: code,
      expires: Date.now() + 10 * 60 * 1000
    };
    return res.status(200).json({
      success: true,
      message: 'A verification code has been generated. For this demonstration, the code is provided here.',
      token: code
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    const record = resetTokens[email];
    if (!record || record.token !== token || record.expires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    delete resetTokens[email];

    return res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerStudent,
  registerCompany,
  registerAdmin,
  login,
  logout,
  forgotPassword,
  resetPassword,
  createToken
};