import React, { useEffect, useMemo, useState } from 'react';
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABELS,
  Badge,
  EmptyState,
  ErrorPanel,
  formatDate,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
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
              <div key={candidate.application_id} className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="font-semibold text-slate-900">{candidate.name}</p>
                <p className="mt-1 text-sm text-slate-600">{candidate.title}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <Badge className={APPLICATION_STATUS_CLASSES.interview_scheduled}>
                    {APPLICATION_STATUS_LABELS.interview_scheduled}
                  </Badge>
                  <span className="text-xs text-slate-500">{candidate.roll_no}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{candidate.email}</p>
                <p className="mt-1 text-xs text-slate-500">Applied: {formatDate(candidate.applied_at)}</p>
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
