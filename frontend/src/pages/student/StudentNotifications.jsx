import { useEffect, useMemo, useState } from 'react';
import {
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
import { getApplications } from '../../services/studentService';

export default function StudentNotifications() {
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
        setError(err?.response?.data?.message || 'Unable to load notifications');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const notifications = useMemo(() => {
    const generated = applications.slice(0, 20).map((application) => {
      const readableStatus = APPLICATION_STATUS_LABELS[application.status] || application.status;
      return {
        id: application.application_id,
        message: `${application.title} at ${application.company_name}: ${readableStatus}`,
        time: application.applied_at,
      };
    });

    if (generated.length === 0) {
      return [
        {
          id: 'welcome',
          message: 'No notifications yet. Apply to jobs to see updates here.',
          time: null,
        },
      ];
    }

    return generated;
  }, [applications]);

  if (loading) return <LoadingPanel message="Loading notifications..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Notifications"
        title="Notifications"
        description="Updates about your applications and interview progress."
      />

      <SectionCard title="Recent Updates">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="group rounded-2xl border border-slate-200/80 bg-white p-5 hover:shadow-md transition-all duration-300 flex items-start gap-4 border-l-4 border-l-indigo-600">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 leading-normal">{notification.message}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{formatDate(notification.time)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No notifications" description="You are all caught up." />
        )}
      </SectionCard>
    </div>
  );
}
