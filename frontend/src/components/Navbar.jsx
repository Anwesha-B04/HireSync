import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">HireSync</span>
          </Link>
        </div>

        <div className="hidden items-center gap-8 sm:flex">
          <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200">Features</a>
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200">Login</Link>
          <Link to="/register" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all duration-200">
            Register Now
          </Link>
        </div>

        <div className="sm:hidden flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600">Login</Link>
          <Link to="/register" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white">Register</Link>
        </div>
      </div>
    </nav>
  )
}

