import { useEffect, useState } from 'react';
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
          <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50/70 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Email address</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {companies.map((company) => (
                  <tr key={company.company_id} className="hover:bg-slate-50/30 transition-colors duration-200">
                    <td className="px-6 py-4.5 font-bold text-slate-800">{company.company_name}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">{company.email}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-500 font-bold">{company.industry}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-600">{company.location}</td>
                    <td className="px-6 py-4.5 text-xs text-indigo-600 font-bold">
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                          {company.website}
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : '-'}
                    </td>
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
