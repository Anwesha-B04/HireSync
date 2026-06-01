import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FeatureCard from '../components/FeatureCard'
import StatCard from '../components/StatCard'

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <header className="bg-gradient-to-b from-indigo-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">HireSync</p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
              Placement Management System for campuses
            </h1>
            <p className="mt-4 text-lg text-indigo-100">
              Streamline recruitment — job postings, applications, shortlisting,
              interviews and analytics across students, companies and placement officers.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold shadow hover:bg-emerald-600">
                Get Started
              </Link>
              <Link to="/login" className="inline-flex items-center rounded-md border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/5">
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Why HireSync?</h3>
              <p className="mt-2 text-sm text-indigo-100">Centralized workflows, faster hiring cycles, and clear analytics.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Features</h2>
          <p className="mt-2 text-slate-600">Essential tools for students, companies and placement officers.</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="Student Portal" description="Create profiles, upload resumes, apply to jobs and track status." />
            <FeatureCard title="Company Portal" description="Post jobs, manage applicants, shortlist candidates and schedule interviews." />
            <FeatureCard title="Placement Management" description="Admin controls, drives, reporting and placement analytics." />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Trusted by numbers</h2>
          <p className="mt-2 text-slate-600">Real-time metrics to track adoption and outcomes.</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Students" value="1,240+" />
            <StatCard label="Companies" value="320+" />
            <StatCard label="Jobs" value="1,980+" />
            <StatCard label="Placements" value="760+" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
