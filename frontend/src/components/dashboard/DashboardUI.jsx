export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/50 pb-6">
      <div>
        {eyebrow ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/50 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {eyebrow}
          </div>
        ) : null}
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate-500 leading-relaxed">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function StatCard({ label, value, helper }) {
  return (
    <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
      {/* Visual Accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-3 text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      {helper ? <p className="mt-2 text-xs text-slate-500 font-medium">{helper}</p> : null}
    </div>
  );
}

export function SectionCard({ title, children, action }) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
        {action}
      </div>
      <div className="px-6 py-6 bg-white">{children}</div>
    </section>
  );
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-bold border ${className}`}>
      {children}
    </span>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center flex flex-col items-center">
      <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4" />
        </svg>
      </div>
      <p className="text-sm font-bold text-slate-800">{title}</p>
      <p className="mt-1.5 text-xs text-slate-500 max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}

export function LoadingPanel({ message = 'Loading...' }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-600"></span>
      </div>
      <p className="mt-6 text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}

export function ErrorPanel({ message }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 text-xs text-rose-700 shadow-sm flex items-start gap-3">
      <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="space-y-1">
        <p className="font-bold">An error occurred</p>
        <p className="text-rose-600/90 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}



