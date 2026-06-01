import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  StatCard,
} from '../../components/dashboard/DashboardUI';
import { getSummary } from '../../services/adminService';

export default function AdminOverview() {
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
        setError(err?.response?.data?.message || 'Unable to load admin dashboard');
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

  if (loading) return <LoadingPanel message="Loading dashboard..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Placement Control Panel"
        description="Monitor students, companies, drives, and reports from one place."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={summary?.students ?? 0} helper="Registered students" />
        <StatCard label="Total Companies" value={summary?.companies ?? 0} helper="Registered companies" />
        <StatCard label="Total Jobs" value={summary?.jobs ?? 0} helper="Job postings" />
        <StatCard label="Total Placements" value={summary?.placements ?? 0} helper="Students placed" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <AnalyticsCard title="Placement Rate" value={analytics.placementRate} detail="Placements vs total students" />
        <AnalyticsCard
          title="Applications per Job"
          value={analytics.jobToApplicationRatio}
          detail="Average applications per job"
        />
        <AnalyticsCard title="Jobs per Company" value={analytics.companyToJobRatio} detail="Average jobs per company" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink to="/admin/students" label="Students" description="Manage student records" />
        <QuickLink to="/admin/companies" label="Companies" description="Manage company accounts" />
        <QuickLink to="/admin/drives" label="Placement Drives" description="View campus drives" />
        <QuickLink to="/admin/reports" label="Reports" description="Analytics and summaries" />
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, detail }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </div>
  );
}

function QuickLink({ to, label, description }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Link>
  );
}
