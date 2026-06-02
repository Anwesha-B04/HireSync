import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  StatCard,
} from '../../components/dashboard/DashboardUI';
import { getDashboard } from '../../services/companyService';

export default function CompanyOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDashboard();
        if (!mounted) return;
        setDashboard(data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load company dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const applicants = dashboard?.applicants || [];
  const interviews = useMemo(
    () => (dashboard?.applicants || []).filter((a) => a.status === 'interview_scheduled'),
    [dashboard?.applicants]
  );
  const activeJobs = useMemo(() => (dashboard?.jobs || []).filter((job) => Number(job.is_active) === 1), [dashboard?.jobs]);

  if (loading) return <LoadingPanel message="Loading dashboard..." />;
  if (error) return <ErrorPanel message={error} />;

  const companyName = dashboard?.company?.company_name || 'Company';

  return (
    <div>
      <PageHeader
        eyebrow="Company Dashboard"
        title={`Welcome, ${companyName}`}
        description="Overview of jobs, applicants, and interviews. Use the sidebar to manage each section."
        action={
          <Link
            to="/company/jobs/new"
            className="inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Post New Job
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Active Jobs"
          value={dashboard?.stats?.activeJobs ?? activeJobs.length}
          helper="Open job postings"
        />
        <StatCard
          label="Applicants"
          value={dashboard?.stats?.applicants ?? applicants.length}
          helper="Total applications received"
        />
        <StatCard
          label="Interviews"
          value={interviews.length}
          helper="Candidates with scheduled interviews"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLink to="/company/jobs" label="Jobs" description="Manage job postings" />
        <QuickLink to="/company/applicants" label="Applicants" description="Review all applications" />
        <QuickLink to="/company/interviews" label="Interviews" description="View scheduled interviews" />
      </div>

      {activeJobs.length > 0 ? (
        <div className="mt-10 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recently Active Jobs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {activeJobs.slice(0, 4).map((job) => (
              <div key={job.job_id} className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-slate-800">{job.title}</p>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/40">Active</Badge>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 font-medium">{job.location}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
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
