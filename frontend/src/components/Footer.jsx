import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">HireSync</h3>
            <p className="mt-2 text-sm text-slate-300">Simplifying campus placements for students and recruiters.</p>
          </div>

          <div className="flex gap-8">
            <div>
              <h4 className="text-sm font-semibold text-white">Product</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/" className="text-slate-300 hover:text-white">Home</Link></li>
                <li><Link to="/login" className="text-slate-300 hover:text-white">Login</Link></li>
                <li><Link to="/register" className="text-slate-300 hover:text-white">Register</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white">Company</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="text-slate-300">Careers</a></li>
                <li><a className="text-slate-300">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-sm text-slate-500">© {new Date().getFullYear()} HireSync. All rights reserved.</div>
      </div>
    </footer>
  )
}
