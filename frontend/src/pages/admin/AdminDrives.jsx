import React, { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  formatDate,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
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
          className="grid gap-4"
        >
          <select
            value={form.company_id}
            onChange={(e) =>
              setForm({
                ...form,
                company_id: e.target.value
              })
            }
            className="rounded-lg border p-3"
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

          <input
            type="date"
            value={form.drive_date}
            onChange={(e) =>
              setForm({
                ...form,
                drive_date: e.target.value
              })
            }
            className="rounded-lg border p-3"
            required
          />

          <input
            type="text"
            placeholder="Venue"
            value={form.venue}
            onChange={(e) =>
              setForm({
                ...form,
                venue: e.target.value
              })
            }
            className="rounded-lg border p-3"
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
            className="rounded-lg border p-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-3 text-white"
          >
            Create Drive
          </button>
        </form>
      </SectionCard>
      <SectionCard title="Drive Schedule">
        {drives.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {drives.map((drive) => (
              <article key={drive.drive_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <button
                  onClick={() => handleDelete(drive.drive_id)}
                  className="mt-4 rounded bg-red-600 px-3 py-2 text-sm text-white"
                >
                  Delete Drive
                </button>
                <p className="text-lg font-semibold text-slate-900">{drive.company_name}</p>
                <p className="mt-2 text-sm text-slate-600">Venue: {drive.venue}</p>
                <p className="mt-1 text-sm text-slate-600">Date: {formatDate(drive.drive_date)}</p>
                {drive.description ? (
                  <p className="mt-3 text-sm text-slate-500">{drive.description}</p>
                ) : null}
              </article>

            ))}
          </div>
        ) : (
          <EmptyState title="No placement drives" description="Create drives from the admin API to list them here." />
        )}
      </SectionCard>
    </div>
  );
}
