import { useEffect, useState } from 'react';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';

import { getInterviews, updateInterviewResult } from '../../services/companyService';

export default function CompanyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await getInterviews();
      setInterviews(data.interviews || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load interviews');
    }
  };

  useEffect(() => {
    let mounted = true;
    const initialLoad = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getInterviews();
        if (!mounted) return;
        setInterviews(data.interviews || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load interviews');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initialLoad();
    return () => {
      mounted = false;
    };
  }, []);

  const handleResultUpdate = async (interviewId, result) => {
    try {
      await updateInterviewResult(interviewId, result);
      await load();
      alert(`Interview result recorded successfully: ${result.toUpperCase()}`);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update interview result');
    }
  };

  if (loading) return <LoadingPanel message="Loading interviews..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Interviews"
        title="Scheduled Interviews"
        description="Record round results and confirm candidate placement selections."
      />

      <SectionCard title="Interview Rounds">
        {interviews.length > 0 ? (
          <div className="space-y-4">
            {interviews.map((round) => {
              const dateStr = new Date(round.interview_date).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              // Status badge style
              let badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';
              if (round.result === 'passed' || round.result === 'selected') {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
              } else if (round.result === 'failed' || round.result === 'rejected') {
                badgeColor = 'bg-rose-50 text-rose-700 border-rose-200/50';
              } else if (round.result === 'pending') {
                badgeColor = 'bg-blue-50 text-blue-700 border-blue-200/50';
              }

              return (
                <div
                  key={round.interview_id}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-l-4 border-l-indigo-600"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-slate-800 text-lg leading-snug">
                        {round.student_name}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {round.roll_no}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-indigo-600/90">
                      {round.round_name} • {round.job_title}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-slate-400 font-medium">
                      <span>Email: <strong className="text-slate-600">{round.email}</strong></span>
                      <span>Scheduled: <strong className="text-slate-650 font-bold">{dateStr}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <Badge className={badgeColor}>
                      {round.result?.toUpperCase()}
                    </Badge>

                    {round.result === 'pending' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleResultUpdate(round.interview_id, 'passed')}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          Pass Round
                        </button>
                        <button
                          onClick={() => handleResultUpdate(round.interview_id, 'selected')}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-colors"
                        >
                          Select candidate 🎉
                        </button>
                        <button
                          onClick={() => handleResultUpdate(round.interview_id, 'failed')}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-750 hover:bg-rose-100 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No scheduled interview rounds"
            description="Go to the Applicants tab and schedule interview rounds for candidates."
          />
        )}
      </SectionCard>
    </div>
  );
}
