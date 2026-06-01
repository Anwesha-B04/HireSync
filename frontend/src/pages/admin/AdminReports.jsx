import React, { useEffect, useMemo, useState } from 'react';
import {
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
  StatCard,
} from '../../components/dashboard/DashboardUI';
import { getSummary } from '../../services/adminService';

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getSummary();
        if (!mounted) return;
        setSummary(data.summary || null);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load reports');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const analytics = useMemo(() => {
    const students = Number(summary?.students || 0);
    const companies = Number(summary?.companies || 0);
    const jobs = Number(summary?.jobs || 0);
    const applications = Number(summary?.applications || 0);
    const placements = Number(summary?.placements || 0);

    return {
      placementRate: students > 0 ? `${Math.round((placements / students) * 100)}%` : '0%',
      jobToApplicationRatio: jobs > 0 ? (applications / jobs).toFixed(1) : '0.0',
      companyToJobRatio: companies > 0 ? (jobs / companies).toFixed(1) : '0.0',
    };
  }, [summary]);

  if (loading) return <LoadingPanel message="Loading reports..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="Placement Reports"
        description="Summary statistics and analytics for the placement process."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={summary?.students ?? 0} />
        <StatCard label="Companies" value={summary?.companies ?? 0} />
        <StatCard label="Jobs" value={summary?.jobs ?? 0} />
        <StatCard label="Applications" value={summary?.applications ?? 0} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <StatCard label="Placements" value={summary?.placements ?? 0} helper="Students successfully placed" />
        <StatCard label="Placement Rate" value={analytics.placementRate} helper="Placements vs students" />
        <StatCard
          label="Applications per Job"
          value={analytics.jobToApplicationRatio}
          helper="Average applications per posting"
        />
      </div>

      <SectionCard title="Detailed Metrics">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Students" value={summary?.students ?? 0} />
          <Metric label="Companies" value={summary?.companies ?? 0} />
          <Metric label="Jobs" value={summary?.jobs ?? 0} />
          <Metric label="Applications" value={summary?.applications ?? 0} />
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-5 text-center ring-1 ring-slate-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
