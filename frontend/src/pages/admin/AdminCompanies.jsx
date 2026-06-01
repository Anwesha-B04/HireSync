import React, { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { getCompanies } from '../../services/adminService';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getCompanies();
        if (!mounted) return;
        setCompanies(data.companies || []);
        setTotal(data.total ?? data.companies?.length ?? 0);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load companies');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingPanel message="Loading companies..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Companies"
        title="Company Management"
        description={`${total} registered companies on the platform.`}
      />

      <SectionCard title="Company List">
        {companies.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {companies.map((company) => (
                  <tr key={company.company_id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{company.company_name}</td>
                    <td className="px-4 py-3 text-slate-600">{company.email}</td>
                    <td className="px-4 py-3">{company.industry}</td>
                    <td className="px-4 py-3">{company.location}</td>
                    <td className="px-4 py-3 text-slate-600">{company.website || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No companies found" description="Company accounts will appear here after registration." />
        )}
      </SectionCard>
    </div>
  );
}
