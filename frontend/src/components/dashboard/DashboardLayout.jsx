import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ brand, navItems }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName =
    user?.profile?.name ||
    user?.name ||
    user?.profile?.company_name ||
    user?.email ||
    'User';

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_55%,_#e2e8f0_100%)] text-slate-900">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex">
          <DashboardSidebar brand={brand} navItems={navItems} />
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/50"
              aria-label="Close menu"
              onClick={closeMobile}
            />
            <div className="relative z-50 h-full shadow-xl">
              <DashboardSidebar brand={brand} navItems={navItems} onNavigate={closeMobile} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-600 lg:hidden">
                    {brand}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
