import { useState } from 'react';
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#f1f5f9_55%,_#e2e8f0_100%)] text-slate-900 font-sans">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex">
          <DashboardSidebar brand={brand} navItems={navItems} />
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
              aria-label="Close menu"
              onClick={closeMobile}
            />
            <div className="relative z-50 h-full shadow-2xl animate-slide-in">
              <DashboardSidebar brand={brand} navItems={navItems} onNavigate={closeMobile} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/55 bg-white/75 px-6 py-4 backdrop-blur-md sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 transition-colors lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-500/10">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 lg:hidden">
                      {brand}
                    </p>
                    <p className="text-sm font-bold text-slate-900">{displayName}</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100/80 px-4 py-2 text-xs font-bold text-rose-600 transition duration-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 px-6 py-10 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
