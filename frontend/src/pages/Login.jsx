import React, { useState } from 'react';
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
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Back to login selection
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">HireSync</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{meta.title}</h1>
          <p className="mt-2 text-slate-600">{meta.description}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {serverError ? (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
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
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
              />
              {errors.email ? <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
              {errors.password ? (
                <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {meta.registerPath ? (
            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to={meta.registerPath} className="font-semibold text-indigo-600 hover:text-indigo-700">
                Register here
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
