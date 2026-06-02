export function formatDate(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export const APPLICATION_STATUS_LABELS = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  selected: 'Selected',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
  withdrew: 'Withdrawn',
};

export const APPLICATION_STATUS_CLASSES = {
  applied: 'bg-slate-50 text-slate-600 border-slate-200',
  shortlisted: 'bg-amber-50 text-amber-700 border-amber-200/50',
  interview_scheduled: 'bg-blue-50 text-blue-700 border-blue-200/50',
  selected: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200/50',
  withdrawn: 'bg-zinc-50 text-zinc-600 border-zinc-200',
  withdrew: 'bg-zinc-50 text-zinc-600 border-zinc-200',
};
