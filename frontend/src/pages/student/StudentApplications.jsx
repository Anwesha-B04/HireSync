import React, { useEffect, useState } from 'react';
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
import { getApplications } from '../../services/studentService';

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getApplications();
        if (!mounted) return;
        setApplications(data.applications || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load applications');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingPanel message="Loading applications..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Applications"
        title="My Applications"
        description="Track the status of every job you have applied to."
      />

      <SectionCard title="Application History">
        {applications.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <div className="col-span-5">Job</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Applied</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {applications.map((application) => {
                const statusKey = application.status || 'applied';
                return (
                  <div key={application.application_id} className="grid grid-cols-12 items-center px-4 py-4 text-sm">
                    <div className="col-span-5 font-medium text-slate-900">{application.title}</div>
                    <div className="col-span-3 text-slate-600">{application.company_name}</div>
                    <div className="col-span-2">
                      <Badge className={APPLICATION_STATUS_CLASSES[statusKey] || 'bg-slate-100 text-slate-700'}>
                        {APPLICATION_STATUS_LABELS[statusKey] || statusKey}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-right text-slate-500">{formatDate(application.applied_at)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="No applications yet" description="Apply to active jobs to start tracking your placements." />
        )}
      </SectionCard>
    </div>
  );
}
