import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  StatCard,
} from '../components/dashboard/DashboardUI';
import { deleteJob, getDashboard } from '../services/companyService';

export default function CompanyJobs() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyJobId, setBusyJobId] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDashboard();
        if (mounted) setDashboard(data);
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || 'Unable to load jobs');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const jobs = dashboard?.jobs || [];
  const activeJobs = useMemo(() => jobs.filter((job) => Number(job.is_active) === 1), [jobs]);

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm('Delete this job posting?');
    if (!confirmed) return;

    try {
      setActionError('');
      setBusyJobId(jobId);
      await deleteJob(jobId);
      const refreshed = await getDashboard();
      setDashboard(refreshed);
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Unable to delete job');
    } finally {
      setBusyJobId(null);
    }
  };

  if (loading) return <LoadingPanel message="Loading jobs..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Jobs"
        title="Company Jobs"
        description="Create, edit, close, and remove job postings."
        action={
          <Link
            to="/company/jobs/new"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Post New Job
          </Link>
        }
      />

      <>
        {actionError ? <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{actionError}</div> : null}

            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <StatCard label="Total Jobs" value={jobs.length} helper="All posted jobs" />
              <StatCard label="Active Jobs" value={activeJobs.length} helper="Currently open jobs" />
              <StatCard label="Closed Jobs" value={jobs.length - activeJobs.length} helper="Inactive postings" />
            </div>

            {jobs.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {jobs.map((job) => (
                  <div key={job.job_id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
                        <p className="mt-1 text-sm text-slate-600">{job.location}</p>
                      </div>
                      <Badge className={Number(job.is_active) === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                        {Number(job.is_active) === 1 ? 'Active' : 'Closed'}
                      </Badge>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm text-slate-600">{job.description}</p>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <Info label="Package" value={`₹${job.package_lpa} LPA`} />
                      <Info label="Min CGPA" value={job.min_cgpa} />
                      <Info label="Applicants" value={job.applicant_count || 0} />
                      <Info label="Shortlisted" value={job.shortlisted_count || 0} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        to={`/company/jobs/${job.job_id}/edit`}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Edit Job
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(job.job_id)}
                        disabled={busyJobId === job.job_id}
                        className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                      >
                        {busyJobId === job.job_id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
        ) : (
          <EmptyState title="No jobs posted yet" description="Post your first role to start collecting applicants." />
        )}
      </>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
