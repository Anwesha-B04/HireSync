import { useEffect, useState, useMemo } from 'react';
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

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minPackage, setMinPackage] = useState('');
  const [maxCgpa, setMaxCgpa] = useState('');

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

  // Extract unique locations for filtering dropdown
  const locations = useMemo(() => {
    const locSet = new Set(jobs.map((job) => job.location).filter(Boolean));
    return Array.from(locSet);
  }, [jobs]);

  // Compute filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        !selectedLocation || job.location.toLowerCase() === selectedLocation.toLowerCase();

      const matchesPackage =
        !minPackage || Number(job.package_lpa) >= Number(minPackage);

      const matchesCgpa =
        !maxCgpa || Number(job.min_cgpa) <= Number(maxCgpa);

      return matchesSearch && matchesLocation && matchesPackage && matchesCgpa;
    });
  }, [jobs, searchTerm, selectedLocation, minPackage, maxCgpa]);

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

      {/* Search and Filters panel */}
      <div className="mb-6 p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Search positions</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full md:w-48">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-36">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Min Package (LPA)</label>
          <input
            type="number"
            value={minPackage}
            onChange={(e) => setMinPackage(e.target.value)}
            placeholder="e.g. 6"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500"
          />
        </div>

        <div className="w-full md:w-36">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Max Req CGPA</label>
          <input
            type="number"
            step="0.1"
            value={maxCgpa}
            onChange={(e) => setMaxCgpa(e.target.value)}
            placeholder="e.g. 8.0"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500"
          />
        </div>
      </div>

      <SectionCard title="Job Listings">
        {filteredJobs.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredJobs.map((job) => {
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
                        <span>Deadline: <strong className="text-slate-850 font-extrabold">{formatDate(job.last_date)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
                    {alreadyApplied ? (
                      <button
                        disabled
                        className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
                      >
                        Applied ✓
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job.job_id)}
                        disabled={!isOpen || busyJobId === job.job_id}
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 hover:shadow-indigo-600/20 active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {busyJobId === job.job_id ? 'Applying...' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No matches found" description="Adjust your filters or query to find active positions." />
        )}
      </SectionCard>
    </div>
  );
}
