
export default function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="mt-3 text-4xl font-extrabold text-slate-900 tracking-tight">{value}</div>
    </div>
  )
}

