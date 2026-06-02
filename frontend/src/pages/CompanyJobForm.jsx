import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LoadingPanel, PageHeader } from '../components/dashboard/DashboardUI';
import { createJob, getDashboard, updateJob } from '../services/companyService';

export default function CompanyJobForm() {
  const { jobId } = useParams();
  const isEditMode = Boolean(jobId);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      package_lpa: '',
      location: '',
      min_cgpa: '',
      last_date: '',
      is_active: true
    }
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const data = await getDashboard();
        const job = (data.jobs || []).find((item) => String(item.job_id) === String(jobId));
        if (!job) {
          setError('Job not found');
          return;
        }

        if (!mounted) return;
        reset({
          title: job.title || '',
          description: job.description || '',
          package_lpa: job.package_lpa ?? '',
          location: job.location || '',
          min_cgpa: job.min_cgpa ?? '',
          last_date: formatDateInput(job.last_date),
          is_active: Number(job.is_active) === 1
        });
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || 'Unable to load job details');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isEditMode, jobId, reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      const payload = {
        title: data.title,
        description: data.description,
        package_lpa: Number(data.package_lpa),
        location: data.location,
        min_cgpa: Number(data.min_cgpa),
        last_date: data.last_date
      };

      if (isEditMode) {
        payload.is_active = Boolean(data.is_active);
        await updateJob(jobId, payload);
      } else {
        await createJob(payload);
      }

      navigate('/company/jobs');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel message="Loading job..." />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow={isEditMode ? 'Edit Job' : 'New Job'}
        title={isEditMode ? 'Update Job Posting' : 'Create Job Posting'}
        action={
          <Link to="/company/jobs" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50">
            Back to Jobs
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-md">
            {error ? (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 flex items-start gap-2.5">
                <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Job Title" error={errors.title?.message}>
                <input {...register('title', { required: 'Job title is required' })} placeholder="e.g. Frontend Engineer" className={inputClass} />
              </Field>

              <Field label="Location" error={errors.location?.message}>
                <input {...register('location', { required: 'Location is required' })} placeholder="e.g. Bangalore, India" className={inputClass} />
              </Field>

              <Field label="Package (LPA)" error={errors.package_lpa?.message}>
                <input type="number" step="0.1" {...register('package_lpa', { required: 'Package is required', valueAsNumber: true })} placeholder="e.g. 12" className={inputClass} />
              </Field>

              <Field label="Minimum CGPA Requirement" error={errors.min_cgpa?.message}>
                <input type="number" step="0.01" {...register('min_cgpa', { required: 'Minimum CGPA is required', valueAsNumber: true })} placeholder="e.g. 7.50" className={inputClass} />
              </Field>

              <Field label="Last Application Date" error={errors.last_date?.message}>
                <input type="date" {...register('last_date', { required: 'Last date is required' })} className={inputClass} />
              </Field>

              {isEditMode ? (
                <div className="flex items-center rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-3 mt-8">
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer select-none">
                    <input type="checkbox" {...register('is_active')} className="h-4.5 w-4.5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    Open for Job Applications
                  </label>
                </div>
              ) : null}

              <div className="md:col-span-2">
                <Field label="Detailed Description" error={errors.description?.message}>
                  <textarea rows={6} {...register('description', { required: 'Description is required' })} placeholder="Describe the role responsibilities, skill set requirements, and selection timeline..." className={inputClass} />
                </Field>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
              <Link to="/company/jobs" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : isEditMode ? 'Update Job Details' : 'Publish Job Listing'}
              </button>
            </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
          <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function formatDateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

const inputClass = 'w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 bg-white transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';