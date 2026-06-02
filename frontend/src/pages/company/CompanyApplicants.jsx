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
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABELS,
} from '../../utils/dashboardUtils';
import { getDashboard, shortlistStudent, scheduleInterview } from '../../services/companyService';

export default function CompanyApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Interview scheduling modal state
  const [schedulingApp, setSchedulingApp] = useState(null); // application object
  const [roundName, setRoundName] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const data = await getDashboard();
      setApplicants(data.applicants || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load applicants');
    }
  };

  useEffect(() => {
    let mounted = true;
    const initialLoad = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDashboard();
        if (!mounted) return;
        setApplicants(data.applicants || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load applicants');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initialLoad();
    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await shortlistStudent(applicationId, status);
      await load();
      alert(`Candidate status updated to ${status}`);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update candidate status');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!roundName || !interviewDate) {
      setSubmitError('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      await scheduleInterview(schedulingApp.application_id, roundName, interviewDate);
      alert('Interview scheduled successfully!');
      setSchedulingApp(null);
      setRoundName('');
      setInterviewDate('');
      await load();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingPanel message="Loading applicants..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Applicants"
        title="All Applicants"
        description="Students who applied to your company's job postings."
      />

      <SectionCard title="Applicant List">
        {applicants.length > 0 ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="grid grid-cols-12 bg-slate-50/70 border-b border-slate-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-3">Student candidate</div>
              <div className="col-span-3">Email address</div>
              <div className="col-span-2">Target job role</div>
              <div className="col-span-1.5">Stage</div>
              <div className="col-span-2.5 text-right">Actions</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {applicants.map((applicant) => {
                const statusKey = applicant.status || 'applied';
                return (
                  <div key={applicant.application_id} className="grid grid-cols-12 items-center px-6 py-4.5 hover:bg-slate-50/30 transition-colors duration-200">
                    <div className="col-span-3 pr-2">
                      <div className="text-sm font-bold text-slate-800">{applicant.name}</div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Roll: {applicant.roll_no}</div>
                    </div>
                    <div className="col-span-3 text-xs font-semibold text-slate-500 truncate pr-2">{applicant.email}</div>
                    <div className="col-span-2 text-xs font-bold text-indigo-600/90 truncate pr-2">{applicant.title}</div>
                    <div className="col-span-1.5">
                      <Badge className={APPLICATION_STATUS_CLASSES[statusKey] || 'bg-slate-50 text-slate-700 border-slate-200'}>
                        {APPLICATION_STATUS_LABELS[statusKey] || statusKey}
                      </Badge>
                    </div>
                    
                    <div className="col-span-2.5 flex items-center justify-end gap-2 text-xs">
                      {applicant.resume_path ? (
                        <a
                          href={`http://localhost:5001/${applicant.resume_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          CV ⬇
                        </a>
                      ) : null}

                      {statusKey === 'applied' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(applicant.application_id, 'shortlisted')}
                            className="rounded-lg bg-indigo-600 px-2.5 py-1.5 font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-colors"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(applicant.application_id, 'rejected')}
                            className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {(statusKey === 'shortlisted' || statusKey === 'interview_scheduled') && (
                        <button
                          onClick={() => setSchedulingApp(applicant)}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1.5 font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-colors"
                        >
                          Schedule Round
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="No applicants yet" description="Applicants will appear once students apply to your jobs." />
        )}
      </SectionCard>

      {/* Schedule Interview Modal overlay */}
      {schedulingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSchedulingApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-extrabold text-slate-800">Schedule Interview Round</h3>
            <p className="text-xs text-slate-500 mt-1">
              Scheduling for <strong>{schedulingApp.name}</strong> for role: <strong>{schedulingApp.title}</strong>
            </p>

            {submitError && (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 px-3 py-2">
                {submitError}
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Round Name</label>
                <input
                  type="text"
                  placeholder="e.g. Technical Interview 1"
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSchedulingApp(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10 disabled:opacity-50"
                >
                  {submitting ? 'Scheduling...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
