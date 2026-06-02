import { useEffect, useState } from 'react';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';

import { getInterviews, getApplications } from '../../services/studentService';

export default function StudentInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const [intData, appData] = await Promise.all([getInterviews(), getApplications()]);
        if (active) {
          setInterviews(intData.interviews || []);
          setApplications(appData.applications || []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Unable to load interview details');
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

  if (loading) return <LoadingPanel message="Loading interviews..." />;
  if (error) return <ErrorPanel message={error} />;

  // Find placement selections
  const placement = applications.find((a) => a.status === 'selected');

  return (
    <div>
      <PageHeader
        eyebrow="Interviews"
        title="My Interviews & Selections"
        description="Track your scheduled rounds and placement results."
      />

      {placement ? (
        <div className="mb-8 overflow-hidden rounded-3xl border border-emerald-200 bg-[radial-gradient(circle_at_top_right,_#ecfdf5,_#d1fae5_60%,_#a7f3d0_120%)] p-8 shadow-md relative">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <svg className="h-40 w-40 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.25z" />
            </svg>
          </div>
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wide">
              🎉 Congratulations!
            </div>
            <h3 className="text-2xl font-black text-emerald-900 leading-snug">
              You are placed at {placement.company_name}!
            </h3>
            <p className="text-sm text-emerald-800/90 leading-relaxed font-semibold">
              You have successfully cleared all selection criteria for the <strong>{placement.title}</strong> role. 
              The package offered is <strong>{placement.package_lpa} LPA</strong>. Joining updates will be shared shortly.
            </p>
          </div>
        </div>
      ) : null}

      <SectionCard title="Scheduled Interview Rounds">
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
              let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
              if (round.result === 'passed' || round.result === 'selected') {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/40';
              } else if (round.result === 'failed' || round.result === 'rejected') {
                badgeColor = 'bg-rose-50 text-rose-700 border-rose-200/40';
              } else if (round.result === 'pending') {
                badgeColor = 'bg-blue-50 text-blue-700 border-blue-200/40';
              }

              return (
                <div
                  key={round.interview_id}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-l-4 border-l-indigo-600"
                >
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-800 text-lg leading-snug">
                      {round.round_name}
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                      {round.job_title} at <strong className="text-slate-700">{round.company_name}</strong>
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold pt-1">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Scheduled: <strong>{dateStr}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <Badge className={badgeColor}>
                      {round.result?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No interviews scheduled"
            description="When companies shortlist you and schedule rounds, details will appear here."
          />
        )}
      </SectionCard>
    </div>
  );
}
