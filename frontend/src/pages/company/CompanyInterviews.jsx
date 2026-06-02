import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import {
  APPLICATION_STATUS_LABELS,
  formatDate,
} from '../../utils/dashboardUtils';
import { getDashboard } from '../../services/companyService';

export default function CompanyInterviews() {
  const [applicants, setApplicants] = useState([]);
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
        setApplicants(data.applicants || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load interviews');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const interviews = useMemo(
    () => applicants.filter((a) => a.status === 'interview_scheduled'),
    [applicants]
  );

  if (loading) return <LoadingPanel message="Loading interviews..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Interviews"
        title="Scheduled Interviews"
        description="Candidates marked for interview rounds."
      />

      <SectionCard title="Interview Schedule">
        {interviews.length > 0 ? (
          <div className="space-y-4">
            {interviews.map((candidate) => (
              <div key={candidate.application_id} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-l-4 border-l-indigo-600">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-slate-800 text-lg leading-snug">{candidate.name}</p>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{candidate.roll_no}</span>
                  </div>
                  <p className="text-xs font-bold text-indigo-600/90">{candidate.title}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-slate-400 font-medium">
                    <span>Email: <strong className="text-slate-600">{candidate.email}</strong></span>
                    <span>Applied: <strong className="text-slate-600">{formatDate(candidate.applied_at)}</strong></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200/50">
                    {APPLICATION_STATUS_LABELS.interview_scheduled}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No interviews scheduled"
            description="Update applicant status to interview_scheduled to see them here."
          />
        )}
      </SectionCard>
    </div>
  );
}
