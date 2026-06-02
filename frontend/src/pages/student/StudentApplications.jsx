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
  formatDate,
} from '../../utils/dashboardUtils';
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
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
            <div className="grid grid-cols-12 bg-slate-50/70 border-b border-slate-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-4">Job details</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-3">Recruitment status</div>
              <div className="col-span-2 text-right">Applied date</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {applications.map((application) => {
                const statusKey = application.status || 'applied';
                return (
                  <div key={application.application_id} className="grid grid-cols-12 items-center px-6 py-4.5 hover:bg-slate-50/30 transition-colors duration-200">
                    <div className="col-span-4 pr-3">
                      <div className="text-sm font-bold text-slate-800">{application.title}</div>
                    </div>
                    <div className="col-span-3 text-xs font-semibold text-slate-500">{application.company_name}</div>
                    <div className="col-span-3">
                      <Badge className={APPLICATION_STATUS_CLASSES[statusKey] || 'bg-slate-50 text-slate-700 border-slate-200'}>
                        {APPLICATION_STATUS_LABELS[statusKey] || statusKey}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-right text-xs text-slate-400 font-medium">{formatDate(application.applied_at)}</div>
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
