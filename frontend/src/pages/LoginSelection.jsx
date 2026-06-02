import { Link } from 'react-router-dom'

export default function LoginSelection() {
  const cards = [
    { 
      label: 'Student Portal', 
      to: '/login/student', 
      description: 'Access academic profile matching, search job posts, view drive dates, and track interview stages.',
      icon: (
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824 2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
      )
    },
    { 
      label: 'Recruiter Portal', 
      to: '/login/company', 
      description: 'Announce open roles, filter candidate applications, invite students to rounds, and mark offers.',
      icon: (
        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      )
    },
    { 
      label: 'Admin Portal', 
      to: '/login/admin', 
      description: 'Oversee student/company verifications, create global drives, monitor active audits, and export statistics.',
      icon: (
        <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_55%,_#e2e8f0_100%)] px-4 py-16 text-slate-900 flex items-center justify-center">
      <div className="mx-auto max-w-4xl w-full">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
                HireSync
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Sign In to Your Portal
            </h1>

            <p className="mt-2 text-slate-600 text-sm">
              Please choose the account type below to access your credentials.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/90 p-8 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white hover:border-indigo-200"
            >
              <div>
                {card.icon}
                <div className="text-lg font-bold text-slate-900 mt-4 group-hover:text-indigo-600 transition-colors">{card.label}</div>
                <p className="text-xs leading-relaxed text-slate-500 mt-3">{card.description}</p>
              </div>
              <div className="mt-6 pt-4">
                <span className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white group-hover:bg-indigo-600 transition-all duration-300 shadow-sm group-hover:shadow-indigo-600/10">
                  Enter Portal
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

