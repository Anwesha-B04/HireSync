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
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';
import RegisterStudent from './pages/RegisterStudent';
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
      title="Registration Selection"
      subtitle="Choose the type of account you want to create."
      cards={[
        { label: 'Student Registration', to: '/register/student', description: 'Create a student account and complete your profile.' },
        { label: 'Company Registration', to: '/register/company', description: 'Create a company account and start posting jobs.' },
      ]}
      backTo="/"
      backLabel="Back to Home"
    />
  );
}

function SelectionPage({ title, subtitle, cards, backTo, backLabel }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">HireSync</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-2 text-slate-600">{subtitle}</p>
          </div>
          <Link to={backTo} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            {backLabel}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-slate-900">{card.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
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
