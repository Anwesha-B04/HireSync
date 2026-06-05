import { useEffect, useMemo, useState } from 'react';
import {
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
  StatCard,
} from '../../components/dashboard/DashboardUI';
import { getSummary, getStudents, getCompanies, getPlacements } from '../../services/adminService';
import { BarChart, DoughnutChart } from '../../components/dashboard/AnalyticsCharts';

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

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

  const systemMetricsData = useMemo(() => [
    { label: 'Students', value: Number(summary?.students || 0), color: '#6366f1' },
    { label: 'Companies', value: Number(summary?.companies || 0), color: '#10b981' },
    { label: 'Jobs', value: Number(summary?.jobs || 0), color: '#8b5cf6' },
    { label: 'Applications', value: Number(summary?.applications || 0), color: '#f59e0b' },
    { label: 'Placements', value: Number(summary?.placements || 0), color: '#f43f5e' },
  ], [summary]);

  const placementStatusData = useMemo(() => {
    const placed = Number(summary?.placements || 0);
    const totalStudents = Number(summary?.students || 0);
    const unplaced = Math.max(0, totalStudents - placed);
    return [
      { label: 'Placed', value: placed, color: '#10b981' },
      { label: 'Unplaced', value: unplaced, color: '#cbd5e1' },
    ];
  }, [summary]);

  const triggerCSVDownload = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data available for export');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...data.map((row) =>
        headers
          .map((header) => {
            const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportStudents = async () => {
    try {
      setExporting(true);
      const data = await getStudents();
      triggerCSVDownload(data.students || [], 'HireSync_Students_Report.csv');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to export students');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCompanies = async () => {
    try {
      setExporting(true);
      const data = await getCompanies();
      triggerCSVDownload(data.companies || [], 'HireSync_Companies_Report.csv');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to export companies');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPlacements = async () => {
    try {
      setExporting(true);
      const data = await getPlacements();
      triggerCSVDownload(data.placements || [], 'HireSync_Placements_Report.csv');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to export placements');
    } finally {
      setExporting(false);
    }
  };

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

      {/* Analytics Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BarChart data={systemMetricsData} title="Campus Activity Breakdown" />
        </div>
        <div>
          <DoughnutChart data={placementStatusData} title="Placement Summary Overview" />
        </div>
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

      <div className="mt-10" />

      <SectionCard title="Download Placement Audit Logs & Reports">
        <p className="text-xs text-slate-500 mb-6 max-w-xl">
          Export structured comma-separated spreadsheet documents for audit, archiving, or department scheduling.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportStudents}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 hover:shadow-indigo-600/20 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Student Database (CSV)
          </button>

          <button
            onClick={handleExportCompanies}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-650 hover:bg-slate-50 shadow-sm transition-all duration-200 disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Registered Companies (CSV)
          </button>

          <button
            onClick={handleExportPlacements}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 hover:shadow-emerald-600/20 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Export Placements Log (CSV)
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
