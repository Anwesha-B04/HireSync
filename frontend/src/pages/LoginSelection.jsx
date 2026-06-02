import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginSelection() {
  const cards = [
    { label: 'Student Login', to: '/login/student', description: 'Access your profile, applications, and interviews.' },
    { label: 'Company Login', to: '/login/company', description: 'Post jobs, manage applicants, and shortlist candidates.' },
    { label: 'Admin Login', to: '/login/admin', description: 'Manage students, companies, jobs, and reports.' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
              HireSync
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Login Selection
            </h1>

            <p className="mt-2 text-slate-600">
              Choose the account type you want to use to sign in.
            </p>
          </div>

          <Link
            to="/"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Back to Home
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-lg font-semibold text-slate-900">{card.label}</div>
              <p className="text-sm text-slate-600">{card.description}</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Proceed</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
