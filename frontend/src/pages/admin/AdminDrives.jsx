import { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import {
  formatDate,
} from '../../utils/dashboardUtils';
import {
  getDrives,
  getCompanies,
  createDrive,
  deleteDrive
} from '../../services/adminService';

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    company_id: '',
    drive_date: '',
    venue: '',
    description: ''
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDrives();
        if (!mounted) return;
        setDrives(data.drives || []);
        const companyData = await getCompanies();
        console.log(companyData);
        if (!mounted) return;
        setCompanies(companyData.companies || []);
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

const handleCreateDrive = async (e) => {
  e.preventDefault();

  try {
    await createDrive(form);

    const refreshed = await getDrives();

    setDrives(refreshed.drives || []);

    setForm({
      company_id: '',
      drive_date: '',
      venue: '',
      description: ''
    });

    alert('Placement drive created');
  } catch (err) {
    alert(
      err?.response?.data?.message ||
      'Failed to create drive'
    );
  }
};

const handleDelete = async (driveId) => {
  if (!window.confirm('Delete this drive?')) {
    return;
  }

  try {
    await deleteDrive(driveId);

    setDrives((prev) =>
      prev.filter((d) => d.drive_id !== driveId)
    );
  } catch {
    alert('Unable to delete drive');
  }
};

  if (loading) return <LoadingPanel message="Loading placement drives..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Placement Drives"
        title="Campus Placement Drives"
        description="Scheduled drives organized by companies."
      />
      <SectionCard title="Create Placement Drive">
        <form
          onSubmit={handleCreateDrive}
          className="grid gap-5 sm:grid-cols-2"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Recruiting Company</label>
            <select
              value={form.company_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  company_id: e.target.value
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            >
              <option value="">
                Select Company
              </option>

              {companies.map((company) => (
                <option
                  key={company.company_id}
                  value={company.company_id}
                >
                  {company.company_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Scheduled Date</label>
            <input
              type="date"
              value={form.drive_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  drive_date: e.target.value
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Drive Venue / Location</label>
            <input
              type="text"
              placeholder="e.g. Campus Seminar Hall A"
              value={form.venue}
              onChange={(e) =>
                setForm({
                  ...form,
                  venue: e.target.value
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description (optional)</label>
            <textarea
              placeholder="Add key highlights about requirements, departments allowed, etc."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              rows={3}
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition duration-200"
            >
              Create Placement Drive
            </button>
          </div>
        </form>
      </SectionCard>

      <div className="mt-10" />

      <SectionCard title="Drive Schedule">
        {drives.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {drives.map((drive) => (
              <article key={drive.drive_id} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xl font-bold text-slate-800">{drive.company_name}</p>
                    <button
                      onClick={() => handleDelete(drive.drive_id)}
                      className="rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 px-3 py-1.5 text-xs font-bold transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Venue: <strong className="text-slate-800">{drive.venue}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Scheduled Date: <strong className="text-slate-800">{formatDate(drive.drive_date)}</strong></span>
                    </div>
                  </div>

                  {drive.description ? (
                    <p className="mt-4 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{drive.description}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No placement drives" description="Create drives using the form above to schedule placement events." />
        )}
      </SectionCard>
    </div>
  );
}
