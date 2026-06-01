export const STUDENT_NAV = [
  { label: 'Overview', path: '/student/dashboard', end: true },
  { label: 'Profile', path: '/student/profile' },
  { label: 'Jobs', path: '/student/jobs' },
  { label: 'Applications', path: '/student/applications' },
  { label: 'Notifications', path: '/student/notifications' },
];

export const COMPANY_NAV = [
  { label: 'Overview', path: '/company/dashboard', end: true },
  { label: 'Jobs', path: '/company/jobs', matchPrefix: '/company/jobs' },
  { label: 'Applicants', path: '/company/applicants' },
  { label: 'Interviews', path: '/company/interviews' },
];

export const ADMIN_NAV = [
  { label: 'Overview', path: '/admin/dashboard', end: true },
  { label: 'Students', path: '/admin/students' },
  { label: 'Companies', path: '/admin/companies' },
  { label: 'Placement Drives', path: '/admin/drives' },
  { label: 'Reports', path: '/admin/reports' },
];
