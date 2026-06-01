const express = require('express');
const { body, param, query } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const controller = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

// Students
router.get('/students', [query('page').optional().isInt({ min: 1 }), query('pageSize').optional().isInt({ min: 1 })], controller.listStudents);
router.get('/students/:studentId', [param('studentId').isInt().withMessage('studentId must be numeric')], controller.getStudent);
router.put(
  '/students/:studentId',
  [
    param('studentId').isInt().withMessage('studentId must be numeric'),
    body('name').optional().notEmpty(),
    body('phone').optional().isString(),
    body('department').optional().notEmpty(),
    body('course').optional().notEmpty(),
    body('cgpa').optional().isFloat({ min: 0, max: 10 }),
    body('passing_year').optional().isInt({ min: 2000, max: 2100 })
  ],
  controller.updateStudent
);
router.delete('/students/:studentId', [param('studentId').isInt().withMessage('studentId must be numeric')], controller.deleteStudent);

// Companies
router.get('/companies', [query('page').optional().isInt({ min: 1 }), query('pageSize').optional().isInt({ min: 1 })], controller.listCompanies);
router.get('/companies/:companyId', [param('companyId').isInt().withMessage('companyId must be numeric')], controller.getCompany);
router.put(
  '/companies/:companyId',
  [
    param('companyId').isInt().withMessage('companyId must be numeric'),
    body('company_name').optional().notEmpty(),
    body('website').optional().isURL().withMessage('website must be a valid URL'),
    body('location').optional().notEmpty(),
    body('industry').optional().notEmpty(),
    body('description').optional().isString()
  ],
  controller.updateCompany
);
router.delete('/companies/:companyId', [param('companyId').isInt().withMessage('companyId must be numeric')], controller.deleteCompany);

// Jobs
router.get('/jobs', controller.listJobs);
router.get('/jobs/:jobId', [param('jobId').isInt().withMessage('jobId must be numeric')], controller.getJob);
router.delete('/jobs/:jobId', [param('jobId').isInt().withMessage('jobId must be numeric')], controller.deleteJob);

// Placement drives
router.get('/drives', controller.listDrives);
router.post(
  '/drives',
  [body('company_id').isInt().withMessage('company_id is required'), body('drive_date').isISO8601().withMessage('drive_date must be a valid date'), body('venue').notEmpty().withMessage('venue is required')],
  controller.createDrive
);
router.put('/drives/:driveId', [param('driveId').isInt().withMessage('driveId must be numeric')], controller.updateDrive);
router.delete('/drives/:driveId', [param('driveId').isInt().withMessage('driveId must be numeric')], controller.deleteDrive);

// Reports
router.get('/reports/summary', controller.summaryReport);

module.exports = router;
