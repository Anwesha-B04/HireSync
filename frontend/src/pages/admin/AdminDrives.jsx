import React, { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  formatDate,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { getDrives } from '../../services/adminService';

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDrives();
        if (!mounted) return;
        setDrives(data.drives || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load placement drives');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingPanel message="Loading placement drives..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Placement Drives"
        title="Campus Placement Drives"
        description="Scheduled drives organized by companies."
      />

      <SectionCard title="Drive Schedule">
        {drives.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {drives.map((drive) => (
              <article key={drive.drive_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-lg font-semibold text-slate-900">{drive.company_name}</p>
                <p className="mt-2 text-sm text-slate-600">Venue: {drive.venue}</p>
                <p className="mt-1 text-sm text-slate-600">Date: {formatDate(drive.drive_date)}</p>
                {drive.description ? (
                  <p className="mt-3 text-sm text-slate-500">{drive.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No placement drives" description="Create drives from the admin API to list them here." />
        )}
      </SectionCard>
    </div>
  );
}
