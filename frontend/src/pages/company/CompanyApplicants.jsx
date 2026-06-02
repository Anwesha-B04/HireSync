import { useEffect, useState } from 'react';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABELS,
  formatDate,
} from '../../utils/dashboardUtils';
import { getDashboard } from '../../services/companyService';

export default function CompanyApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDashboard();
        if (!mounted) return;
        setApplicants(data.applicants || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load applicants');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingPanel message="Loading applicants..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Applicants"
        title="All Applicants"
        description="Students who applied to your company's job postings."
      />

      <SectionCard title="Applicant List">
        {applicants.length > 0 ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
            <div className="grid grid-cols-12 bg-slate-50/70 border-b border-slate-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-3">Student candidate</div>
              <div className="col-span-3">Email address</div>
              <div className="col-span-3">Target job role</div>
              <div className="col-span-2">Recruitment stage</div>
              <div className="col-span-1 text-right">Applied</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {applicants.map((applicant) => {
                const statusKey = applicant.status || 'applied';
                return (
                  <div key={applicant.application_id} className="grid grid-cols-12 items-center px-6 py-4.5 hover:bg-slate-50/30 transition-colors duration-200">
                    <div className="col-span-3 pr-2">
                      <div className="text-sm font-bold text-slate-800">{applicant.name}</div>
                    </div>
                    <div className="col-span-3 text-xs font-semibold text-slate-500 truncate pr-2">{applicant.email}</div>
                    <div className="col-span-3 text-xs font-bold text-indigo-600/90 truncate pr-2">{applicant.title}</div>
                    <div className="col-span-2">
                      <Badge className={APPLICATION_STATUS_CLASSES[statusKey] || 'bg-slate-50 text-slate-700 border-slate-200'}>
                        {APPLICATION_STATUS_LABELS[statusKey] || statusKey}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right text-xs text-slate-400 font-medium">{formatDate(applicant.applied_at)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="No applicants yet" description="Applicants will appear once students apply to your jobs." />
        )}
      </SectionCard>
    </div>
  );
}
