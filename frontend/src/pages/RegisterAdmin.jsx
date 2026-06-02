import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardPathForRole } from '../utils/auth';
import api from '../services/api';

export default function RegisterAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);

    try {
      const response = await api.post('/api/auth/register/admin', {
        email: data.email,
        password: data.password,
        name: data.name
      });

      const res = response.data;

      if (res?.token) {
        localStorage.setItem('token', res.token);
      }

      if (res?.user) {
        navigate(dashboardPathForRole(res.user.role));
      }
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Registration failed'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_55%,_#e2e8f0_100%)] px-4 py-16 text-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-3xl border border-slate-200/70 shadow-2xl backdrop-blur-sm">
        
        <div className="mb-8">
          <Link 
            to="/register" 
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to selection
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-md bg-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 font-bold">Admin Portal</p>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-slate-900">Admin Registration</h2>
          <p className="text-sm text-slate-500 mt-1">Register a placement coordinator account to control drives.</p>
        </div>

        {serverError && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 flex items-start gap-2.5">
            <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
              <input 
                {...register('name', { required: 'Name required' })} 
                placeholder="Administrator Name"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
              <input 
                {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} 
                placeholder="admin@hiresync.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Account Password</label>
              <input 
                type="password" 
                {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Minimum 8 characters' } })} 
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 hover:shadow-indigo-600/20 active:translate-y-px transition-all">
              Create Admin Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}