import { useEffect, useState } from 'react';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { getCompanies, updateCompanyStatus } from '../../services/adminService';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data.companies || []);
      setTotal(data.total ?? data.companies?.length ?? 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load companies');
    }
  };

  useEffect(() => {
    let mounted = true;
    const initialLoad = async () => {
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
    initialLoad();
    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusUpdate = async (companyId, status) => {
    try {
      await updateCompanyStatus(companyId, status);
      await load();
      alert(`Company status updated to: ${status}`);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update company status');
    }
  };

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
                  <th className="px-6 py-4">Industry & Location</th>
                  <th className="px-6 py-4">Website</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {companies.map((company) => {
                  const status = company.status || 'approved';
                  let statusBadge = 'bg-slate-50 text-slate-700 border-slate-200';
                  if (status === 'approved') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200/40';
                  if (status === 'rejected') statusBadge = 'bg-rose-50 text-rose-700 border-rose-200/40';
                  if (status === 'pending') statusBadge = 'bg-amber-50 text-amber-700 border-amber-200/40';

                  return (
                    <tr key={company.company_id} className="hover:bg-slate-50/30 transition-colors duration-200">
                      <td className="px-6 py-4.5">
                        <div className="font-bold text-slate-800">{company.company_name}</div>
                        {company.description ? (
                          <div className="text-[10px] text-slate-400 font-semibold truncate max-w-xs">{company.description}</div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">{company.email}</td>
                      <td className="px-6 py-4.5">
                        <div className="text-xs text-slate-650 font-bold">{company.industry}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{company.location}</div>
                      </td>
                      <td className="px-6 py-4.5 text-xs text-indigo-600 font-bold">
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                            {company.website}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4.5">
                        <Badge className={statusBadge}>{status.toUpperCase()}</Badge>
                      </td>
                      <td className="px-6 py-4.5 text-right text-xs">
                        {status === 'pending' && (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleStatusUpdate(company.company_id, 'approved')}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1.5 font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(company.company_id, 'rejected')}
                              className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {status !== 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(company.company_id, status === 'approved' ? 'rejected' : 'approved')}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                          >
                            Toggle Approval
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
