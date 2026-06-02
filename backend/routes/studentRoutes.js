const express = require('express');
const { body, param } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const studentController = require('../controllers/studentController');

// prepare upload directory
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
    cb(null, safeName);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// All student routes are protected and only for role 'student'
router.use(protect, authorizeRoles('student'));

router.get('/profile', studentController.getProfile);

router.put(
  '/profile',
  [
    body('rollNo').notEmpty().withMessage('Roll number is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('cgpa').isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
    body('passingYear').isInt({ min: 2000, max: 2100 }).withMessage('Passing year invalid')
  ],
  studentController.updateProfile
);

router.post('/resume', upload.single('resume'), studentController.uploadResume);

router.post('/skills', studentController.addSkill);

router.delete(
  '/skills/:skillId',
  studentController.removeSkill
);

router.get('/jobs', studentController.viewJobs);

router.post('/jobs/:jobId/apply', [param('jobId').isInt().withMessage('jobId must be numeric')], studentController.applyJob);

router.get('/applications', studentController.viewApplications);

module.exports = router;
