import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardPathForRole, LOGIN_PAGE_META } from '../utils/auth';

export default function Login({ expectedRole = 'student' }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const meta = LOGIN_PAGE_META[expectedRole] || LOGIN_PAGE_META.student;

  const onSubmit = async (data) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await login(data.email, data.password);

      if (!res?.token || !res?.user) {
        setServerError(res?.message || 'Login failed. Please try again.');
        return;
      }

      const { role } = res.user;

      if (role !== expectedRole) {
        setServerError(
          `This account is registered as ${role}. Please use the ${role} login page instead.`
        );
        return;
      }

      navigate(dashboardPathForRole(role));
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_55%,_#e2e8f0_100%)] px-4 py-16 text-slate-900 flex items-center justify-center">
      <div className="mx-auto max-w-md w-full">
        <div className="mb-8 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login selection
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">HireSync</p>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{meta.title}</h1>
          <p className="mt-2 text-slate-500 text-sm">{meta.description}</p>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
          {serverError ? (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 flex items-start gap-2.5">
              <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{serverError}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
              />
              {errors.email ? (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <input
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
              {errors.password ? (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 hover:shadow-indigo-600/20 active:translate-y-px transition-all disabled:cursor-not-allowed disabled:opacity-60 mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {meta.registerPath ? (
            <p className="mt-6 text-center text-xs text-slate-500 leading-normal">
              Don&apos;t have an account?{' '}
              <Link to={meta.registerPath} className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Register here
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
