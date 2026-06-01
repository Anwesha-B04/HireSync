import React, { useEffect, useMemo, useState } from 'react';
import {
  APPLICATION_STATUS_LABELS,
  EmptyState,
  ErrorPanel,
  formatDate,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
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
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">{notification.message}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(notification.time)}</p>
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
