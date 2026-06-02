import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  StatCard,
} from '../../components/dashboard/DashboardUI';
import { getDashboardData } from '../../services/studentService';

export default function StudentOverview() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDashboardData();
        if (!mounted) return;
        setProfile(data.profile || null);
        setApplications(data.applications || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load dashboard data');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const upcomingInterviews = applications.filter((a) => a.status === 'interview_scheduled').length;
    const shortlisted = applications.filter((a) => a.status === 'shortlisted').length;
    const selected = applications.filter((a) => a.status === 'selected').length;
    return { total: applications.length, upcomingInterviews, shortlisted, selected };
  }, [applications]);

  if (loading) return <LoadingPanel message="Loading dashboard..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Student Dashboard"
        title={`Welcome${profile?.name ? `, ${profile.name}` : ''}`}
        description="Quick overview of your placement activity. Use the sidebar to open Profile, Jobs, Applications, or Notifications."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Applications" value={stats.total} helper="All submitted job applications" />
        <StatCard label="Upcoming Interviews" value={stats.upcomingInterviews} helper="Scheduled interview rounds" />
        <StatCard label="Shortlisted" value={stats.shortlisted} helper="Applications moved forward" />
        <StatCard label="Selected" value={stats.selected} helper="Jobs where you cleared selection" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink to="/student/profile" label="Profile" description="View and manage your student profile" />
        <QuickLink to="/student/jobs" label="Jobs" description="Browse active placement openings" />
        <QuickLink to="/student/applications" label="Applications" description="Track every job you applied to" />
        <QuickLink to="/student/notifications" label="Notifications" description="See status updates and alerts" />
      </div>
    </div>
  );
}

function QuickLink({ to, label, description }) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{label}</p>
          <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all duration-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
