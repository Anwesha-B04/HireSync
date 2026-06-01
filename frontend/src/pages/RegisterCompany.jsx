import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardPathForRole } from '../utils/auth';

export default function RegisterCompany() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { registerCompany } = useAuth();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        website: data.website || null,
        location: data.location,
        industry: data.industry,
        description: data.description || null
      };
      const res = await registerCompany(payload);
      if (res?.user) navigate(dashboardPathForRole(res.user.role));
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Company Registration</h2>

        {serverError && <div className="text-sm text-red-600 mb-2">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} className="w-full px-3 py-2 border rounded" />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} className="w-full px-3 py-2 border rounded" />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input {...register('companyName', { required: 'Company name required' })} className="w-full px-3 py-2 border rounded" />
              {errors.companyName && <p className="text-sm text-red-600">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input {...register('website', { pattern: { value: /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: 'Invalid URL' } })} className="w-full px-3 py-2 border rounded" />
              {errors.website && <p className="text-sm text-red-600">{errors.website.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input {...register('location', { required: 'Location required' })} className="w-full px-3 py-2 border rounded" />
              {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input {...register('industry', { required: 'Industry required' })} className="w-full px-3 py-2 border rounded" />
              {errors.industry && <p className="text-sm text-red-600">{errors.industry.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea {...register('description')} className="w-full px-3 py-2 border rounded" rows={3} />
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Register as Company</button>
          </div>
        </form>
      </div>
    </div>
  );
}
