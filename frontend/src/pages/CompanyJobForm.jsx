import React, { useEffect, useState } from 'react';
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

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {error ? <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div> : null}

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Job Title" error={errors.title?.message}>
                <input {...register('title', { required: 'Job title is required' })} className={inputClass} />
              </Field>

              <Field label="Location" error={errors.location?.message}>
                <input {...register('location', { required: 'Location is required' })} className={inputClass} />
              </Field>

              <Field label="Package (LPA)" error={errors.package_lpa?.message}>
                <input type="number" step="0.1" {...register('package_lpa', { required: 'Package is required', valueAsNumber: true })} className={inputClass} />
              </Field>

              <Field label="Minimum CGPA" error={errors.min_cgpa?.message}>
                <input type="number" step="0.01" {...register('min_cgpa', { required: 'Minimum CGPA is required', valueAsNumber: true })} className={inputClass} />
              </Field>

              <Field label="Last Application Date" error={errors.last_date?.message}>
                <input type="date" {...register('last_date', { required: 'Last date is required' })} className={inputClass} />
              </Field>

              {isEditMode ? (
                <div className="flex items-end rounded-2xl bg-slate-50 px-4 py-3">
                  <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    Active job posting
                  </label>
                </div>
              ) : null}

              <div className="md:col-span-2">
                <Field label="Description" error={errors.description?.message}>
                  <textarea rows={6} {...register('description', { required: 'Description is required' })} className={inputClass} />
                </Field>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Link to="/company/jobs" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold shadow-sm hover:bg-slate-50">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : isEditMode ? 'Update Job' : 'Create Job'}
              </button>
            </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

function formatDateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

const inputClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100';