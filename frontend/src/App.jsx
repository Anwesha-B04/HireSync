import './App.css'
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { dashboardPathForRole, getTokenRole } from './utils/auth';
import AdminLayout from './layouts/AdminLayout';
import CompanyLayout from './layouts/CompanyLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminDrives from './pages/admin/AdminDrives';
import AdminOverview from './pages/admin/AdminOverview';
import AdminReports from './pages/admin/AdminReports';
import AdminStudents from './pages/admin/AdminStudents';
import CompanyApplicants from './pages/company/CompanyApplicants';
import CompanyInterviews from './pages/company/CompanyInterviews';
import CompanyOverview from './pages/company/CompanyOverview';
import CompanyJobForm from './pages/CompanyJobForm';
import CompanyJobs from './pages/CompanyJobs';
import StudentApplications from './pages/student/StudentApplications';
import StudentJobs from './pages/student/StudentJobs';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentOverview from './pages/student/StudentOverview';
import StudentProfile from './pages/student/StudentProfile';
import StudentDrives from './pages/student/StudentDrives';
import StudentInterviews from './pages/student/StudentInterviews';
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';
import RegisterStudent from './pages/RegisterStudent';
import RegisterAdmin from './pages/RegisterAdmin';
import Landing from './pages/Landing';
import LoginSelection from './pages/LoginSelection';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<GuestOnlyRoute><LoginSelection /></GuestOnlyRoute>} />
      <Route path="/login/student" element={<GuestOnlyRoute><Login expectedRole="student" /></GuestOnlyRoute>} />
      <Route path="/login/company" element={<GuestOnlyRoute><Login expectedRole="company" /></GuestOnlyRoute>} />
      <Route path="/login/admin" element={<GuestOnlyRoute><Login expectedRole="admin" /></GuestOnlyRoute>} />

      <Route path="/register" element={<GuestOnlyRoute><RegisterSelectionPage /></GuestOnlyRoute>} />
      <Route path="/register/student" element={<GuestOnlyRoute><RegisterStudent /></GuestOnlyRoute>} />
      <Route path="/register/company" element={<GuestOnlyRoute><RegisterCompany /></GuestOnlyRoute>} />
      <Route path="/register/admin" element={<GuestOnlyRoute><RegisterAdmin /></GuestOnlyRoute>} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentOverview />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="jobs" element={<StudentJobs />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="drives" element={<StudentDrives />} />
        <Route path="interviews" element={<StudentInterviews />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyOverview />} />
        <Route path="jobs" element={<CompanyJobs />} />
        <Route path="jobs/new" element={<CompanyJobForm />} />
        <Route path="jobs/:jobId/edit" element={<CompanyJobForm />} />
        <Route path="applicants" element={<CompanyApplicants />} />
        <Route path="interviews" element={<CompanyInterviews />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="drives" element={<AdminDrives />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route path="/student/dashboard" element={<LegacySectionRedirect role="student" section="dashboard" />} />
      <Route path="/company/dashboard" element={<LegacySectionRedirect role="company" section="dashboard" />} />
      <Route path="/admin/dashboard" element={<LegacySectionRedirect role="admin" section="dashboard" />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function RegisterSelectionPage() {
  return (
    <SelectionPage
      title="Create Your Account"
      subtitle="Choose the type of account you want to create to join our placement platform."
      cards={[
        { 
          label: 'Student Registration', 
          to: '/register/student', 
          description: 'Build your campus profile, manage your resume, and start applying to recruitment drives.',
          icon: (
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824 2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          )
        },
        { 
          label: 'Company Registration', 
          to: '/register/company', 
          description: 'Register your organization, set up selection rules, and publish active job opportunities.',
          icon: (
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )
        },
        { 
          label: 'Admin Registration', 
          to: '/register/admin', 
          description: 'Register as an institutional placement officer to organize recruitment calendars.',
          icon: (
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )
        },
      ]}
      backTo="/"
      backLabel="Back to Home"
    />
  );
}

function SelectionPage({ title, subtitle, cards, backTo, backLabel }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_55%,_#e2e8f0_100%)] px-4 py-16 text-slate-900 flex items-center justify-center">
      <div className="mx-auto max-w-4xl w-full">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">HireSync</p>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
            <p className="mt-2 text-slate-600 text-sm">{subtitle}</p>
          </div>
          <Link to={backTo} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {backLabel}
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/90 p-8 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white hover:border-indigo-200"
            >
              <div>
                {card.icon}
                <h2 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-indigo-600 transition-colors">{card.label}</h2>
                <p className="text-xs leading-relaxed text-slate-500 mt-3">{card.description}</p>
              </div>
              <div className="mt-6 pt-4">
                <span className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white group-hover:bg-indigo-600 transition-all duration-300 shadow-sm group-hover:shadow-indigo-600/10">
                  Register
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function ProtectedRoute({ allowedRoles, children }) {
  const role = useCurrentRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={dashboardPathForRole(role)} replace />;
  }

  return children;
}

function GuestOnlyRoute({ children }) {
  const role = useCurrentRole();

  if (role) {
    return <Navigate to={dashboardPathForRole(role)} replace />;
  }

  return children;
}

function LegacySectionRedirect({ role, section }) {
  const currentRole = useCurrentRole();

  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole !== role) {
    return <Navigate to={dashboardPathForRole(currentRole)} replace />;
  }

  return <Navigate to={`/${role}/${section}`} replace />;
}

function useCurrentRole() {
  const { user, token } = useAuth();
  return user?.role || getTokenRole(token);
}

export default App
