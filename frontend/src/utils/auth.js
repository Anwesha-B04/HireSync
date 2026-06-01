export function dashboardPathForRole(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'company':
      return '/company/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/';
  }
}

export function getTokenRole(token) {
  if (!token) return null;

  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    return decoded?.role || null;
  } catch {
    return null;
  }
}

export const LOGIN_PAGE_META = {
  student: {
    title: 'Student Login',
    description: 'Sign in to manage your profile, applications, and interviews.',
    registerPath: '/register/student',
  },
  company: {
    title: 'Company Login',
    description: 'Sign in to post jobs, review applicants, and manage placements.',
    registerPath: '/register/company',
  },
  admin: {
    title: 'Admin Login',
    description: 'Sign in to manage students, companies, jobs, and reports.',
    registerPath: null,
  },
};
