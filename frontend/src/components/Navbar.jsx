import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">HS</div>
            <span className="font-semibold text-slate-900">HireSync</span>
          </Link>
        </div>

        <div className="hidden items-center gap-6 sm:flex">
          <Link to="#features" className="text-sm text-slate-700 hover:text-slate-900">Features</Link>
          <Link to="/login" className="text-sm text-slate-700 hover:text-slate-900">Login</Link>
          <Link to="/register" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Register</Link>
        </div>

        <div className="sm:hidden">
          <Link to="/login" className="text-sm text-slate-700">Login</Link>
        </div>
      </div>
    </nav>
  )
}
