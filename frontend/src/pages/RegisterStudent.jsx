import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardPathForRole } from '../utils/auth';

export default function RegisterStudent() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { registerStudent } = useAuth();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        name: data.name,
        rollNo: data.rollNo,
        department: data.department,
        course: data.course,
        cgpa: Number(data.cgpa),
        passingYear: Number(data.passingYear)
      };
      const res = await registerStudent(payload);
      if (res?.user) navigate(dashboardPathForRole(res.user.role));
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_55%,_#e2e8f0_100%)] px-4 py-16 text-slate-900 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/90 p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-2xl backdrop-blur-sm">
        
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
            <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">Student Portal</p>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-slate-900">Student Registration</h2>
          <p className="text-sm text-slate-500 mt-1">Fill in the fields below to create your official placement account.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
              <input 
                {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} 
                placeholder="you@domain.com"
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
                {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} 
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
              <input 
                {...register('name', { required: 'Name required' })} 
                placeholder="John Doe"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Roll Number</label>
              <input 
                {...register('rollNo', { required: 'Roll number required' })} 
                placeholder="e.g. CSE-2026-042"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
              />
              {errors.rollNo && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.rollNo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Department</label>
              <input 
                {...register('department', { required: 'Department required' })} 
                placeholder="e.g. Computer Science"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
              />
              {errors.department && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Course</label>
              <input 
                {...register('course', { required: 'Course required' })} 
                placeholder="e.g. B.Tech"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
              />
              {errors.course && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.course.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Cumulative CGPA</label>
              <input 
                type="number" 
                step="0.01" 
                {...register('cgpa', { required: 'CGPA required', min: { value: 0, message: 'Minimum 0' }, max: { value: 10, message: 'Maximum 10' } })} 
                placeholder="0.00 - 10.00"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
              />
              {errors.cgpa && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.cgpa.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Passing Year</label>
              <input 
                type="number" 
                {...register('passingYear', { required: 'Passing year required', min: { value: 2000, message: 'Invalid year' }, max: { value: 2100, message: 'Invalid year' } })} 
                placeholder="e.g. 2026"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" 
              />
              {errors.passingYear && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                  {errors.passingYear.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 hover:shadow-indigo-600/20 active:translate-y-px transition-all">
              Create Student Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
