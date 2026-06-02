const express = require('express');
const { body } = require('express-validator');
const {
  registerStudent,
  registerCompany,
  registerAdmin,
  login,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const emailValidation = body('email')
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long');

router.post(
  '/register/student',
  [
    emailValidation,
    passwordValidation,
    body('name').notEmpty().withMessage('Name is required'),
    body('rollNo').notEmpty().withMessage('Roll number is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('cgpa').isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
    body('passingYear').isInt({ min: 2000, max: 2100 }).withMessage('Passing year must be valid')
  ],
  registerStudent
);

router.post(
  '/register/company',
  [
    emailValidation,
    passwordValidation,
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('industry').notEmpty().withMessage('Industry is required')
  ],
  registerCompany
);

router.post(
  '/register/admin',
  [
    emailValidation,
    passwordValidation,
    body('name')
      .notEmpty()
      .withMessage('Name is required')
  ],
  registerAdmin
);

router.post(
  '/login',
  [
    emailValidation,
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.post('/logout', protect, logout);

module.exports = router;