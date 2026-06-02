const express = require('express');
const { body, param } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const controller = require('../controllers/companyController');

const router = express.Router();

router.use(protect, authorizeRoles('company'));

router.get('/profile', controller.getProfile);
router.get('/dashboard', controller.getDashboard);

router.post(
  '/jobs',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('package_lpa').isFloat({ min: 0 }).withMessage('Package must be >= 0'),
    body('location').notEmpty().withMessage('Location is required'),
    body('min_cgpa').isFloat({ min: 0, max: 10 }).withMessage('min_cgpa must be between 0 and 10'),
    body('last_date').isISO8601().withMessage('last_date must be a valid date')
  ],
  controller.createJob
);

router.put(
  '/jobs/:jobId',
  [
    param('jobId').isInt().withMessage('jobId must be numeric'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('package_lpa').isFloat({ min: 0 }).withMessage('Package must be >= 0'),
    body('location').notEmpty().withMessage('Location is required'),
    body('min_cgpa').isFloat({ min: 0, max: 10 }).withMessage('min_cgpa must be between 0 and 10'),
    body('last_date').isISO8601().withMessage('last_date must be a valid date'),
    body('is_active').optional().isBoolean().withMessage('is_active must be boolean')
  ],
  controller.editJob
);

router.delete('/jobs/:jobId', [param('jobId').isInt().withMessage('jobId must be numeric')], controller.deleteJob);

router.get('/jobs/:jobId/applicants', [param('jobId').isInt().withMessage('jobId must be numeric')], controller.viewApplicants);

router.post(
  '/applications/:applicationId/shortlist',
  [
    param('applicationId').isInt().withMessage('applicationId must be numeric'),
    body('status').isIn(['shortlisted', 'rejected', 'interview_scheduled', 'selected']).withMessage('Invalid status')
  ],
  controller.shortlistStudent
);

router.post(
  '/interviews',
  [
    body('applicationId').isInt().withMessage('applicationId must be integer'),
    body('roundName').notEmpty().withMessage('roundName is required'),
    body('interviewDate').isISO8601().withMessage('interviewDate must be a valid ISO date')
  ],
  controller.scheduleInterview
);

router.get('/interviews', controller.getInterviews);

router.put(
  '/interviews/:interviewId/result',
  [
    param('interviewId').isInt().withMessage('interviewId must be numeric'),
    body('result').isIn(['pending', 'passed', 'failed', 'selected', 'rejected']).withMessage('Invalid result')
  ],
  controller.updateInterviewResult
);

module.exports = router;
