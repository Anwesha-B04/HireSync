import { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { formatDate } from '../../utils/dashboardUtils';
import { getDrives } from '../../services/studentService';

export default function StudentDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const data = await getDrives();
        if (active) {
          setDrives(data.drives || []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Unable to load placement drives');
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

  if (loading) return <LoadingPanel message="Loading drives..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Placement Drives"
        title="Upcoming Drives"
        description="Schedule of hiring drives on campus."
      />

      <SectionCard title="Active Placement Drives">
        {drives.length > 0 ? (
          <div className="space-y-4">
            {drives.map((drive) => (
              <div
                key={drive.drive_id}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-l-4 border-l-indigo-600"
              >
                <div className="space-y-2">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg leading-snug">
                      {drive.company_name}
                    </h4>
                    {drive.website ? (
                      <a
                        href={drive.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 font-bold hover:underline"
                      >
                        {drive.website}
                      </a>
                    ) : null}
                  </div>
                  {drive.description ? (
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {drive.description}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5 md:text-right shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold md:justify-end">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(drive.drive_date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold md:justify-end">
                    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{drive.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No drives scheduled"
            description="Coordinators will update soon when company drives are scheduled."
          />
        )}
      </SectionCard>
    </div>
  );
}
