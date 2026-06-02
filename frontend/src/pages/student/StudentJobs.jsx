import { useEffect, useState } from 'react';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import {
  formatDate,
} from '../../utils/dashboardUtils';
import { applyToJob, getApplications, getJobs } from '../../services/studentService';

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busyJobId, setBusyJobId] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const [jobsData, applicationsData] = await Promise.all([getJobs(), getApplications()]);
        if (active) {
          setJobs(jobsData.jobs || []);
          const ids = new Set((applicationsData.applications || []).map((a) => a.job_id));
          setAppliedJobIds(ids);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Unable to load jobs');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
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
                <article key={job.job_id} className="group rounded-3xl border border-slate-200/80 bg-slate-50/40 p-6 hover:bg-white hover:shadow-lg hover:border-indigo-200/60 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{job.company_name}</p>
                      </div>
                      <Badge
                        className={
                          isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200/40' : 'bg-amber-50 text-amber-700 border-amber-200/40'
                        }
                      >
                        {isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>

                    <p className="mt-4 text-xs text-slate-500 leading-relaxed line-clamp-3">{job.description}</p>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200/40 pt-4 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Package: <strong className="text-slate-800">₹{job.package_lpa} LPA</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Min CGPA: <strong className="text-slate-800">{job.min_cgpa}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Location: <strong className="text-slate-800">{job.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Deadline: <strong className="text-slate-800">{formatDate(job.last_date)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!isOpen || alreadyApplied || busyJobId === job.job_id}
                    onClick={() => handleApply(job.job_id)}
                    className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-all disabled:cursor-not-allowed disabled:opacity-60"
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
