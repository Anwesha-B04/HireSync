import React, { useEffect, useState } from 'react';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  formatDate,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { applyToJob, getApplications, getJobs } from '../../services/studentService';

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busyJobId, setBusyJobId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [jobsData, applicationsData] = await Promise.all([getJobs(), getApplications()]);
      setJobs(jobsData.jobs || []);
      const ids = new Set((applicationsData.applications || []).map((a) => a.job_id));
      setAppliedJobIds(ids);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApply = async (jobId) => {
    try {
      setActionMessage('');
      setBusyJobId(jobId);
      await applyToJob(jobId);
      setAppliedJobIds((prev) => new Set(prev).add(jobId));
      setActionMessage('Application submitted successfully.');
    } catch (err) {
      setActionMessage(err?.response?.data?.message || 'Unable to apply for this job');
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
        title="Available Jobs"
        description="Browse active job postings. Open roles accept applications; past-deadline roles remain visible for reference."
      />

      {actionMessage ? (
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          {actionMessage}
        </div>
      ) : null}

      <SectionCard title="Job Listings">
        {jobs.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {jobs.map((job) => {
              const alreadyApplied = appliedJobIds.has(job.job_id);
              const isOpen = Number(job.is_open_for_application) === 1;
              return (
                <article key={job.job_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{job.company_name}</p>
                    </div>
                    <Badge
                      className={
                        isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }
                    >
                      {isOpen ? 'Open' : 'Deadline passed'}
                    </Badge>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm text-slate-600">{job.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
                    <p>Package: ₹{job.package_lpa} LPA</p>
                    <p>Min CGPA: {job.min_cgpa}</p>
                    <p>Location: {job.location}</p>
                    <p>Last date: {formatDate(job.last_date)}</p>
                  </div>
                  <button
                    type="button"
                    disabled={!isOpen || alreadyApplied || busyJobId === job.job_id}
                    onClick={() => handleApply(job.job_id)}
                    className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {!isOpen
                      ? 'Deadline passed'
                      : alreadyApplied
                        ? 'Applied'
                        : busyJobId === job.job_id
                          ? 'Applying...'
                          : 'Apply Now'}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No jobs available" description="Check back later for new placement openings." />
        )}
      </SectionCard>
    </div>
  );
}
