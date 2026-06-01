import React, { useEffect, useState } from 'react';
import {
  APPLICATION_STATUS_CLASSES,
  APPLICATION_STATUS_LABELS,
  Badge,
  EmptyState,
  ErrorPanel,
  formatDate,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
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
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <div className="col-span-3">Student</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-3">Job</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Applied</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {applicants.map((applicant) => {
                const statusKey = applicant.status || 'applied';
                return (
                  <div key={applicant.application_id} className="grid grid-cols-12 items-center px-4 py-4 text-sm">
                    <div className="col-span-3 font-medium text-slate-900">{applicant.name}</div>
                    <div className="col-span-3 text-slate-600">{applicant.email}</div>
                    <div className="col-span-3 text-slate-600">{applicant.title}</div>
                    <div className="col-span-2">
                      <Badge className={APPLICATION_STATUS_CLASSES[statusKey] || 'bg-slate-100 text-slate-700'}>
                        {APPLICATION_STATUS_LABELS[statusKey] || statusKey}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right text-slate-500">{formatDate(applicant.applied_at)}</div>
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
