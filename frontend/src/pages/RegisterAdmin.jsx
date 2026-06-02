import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">
          Admin Registration
        </h2>

        {serverError && (
          <div className="text-sm text-red-600 mb-2">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">

            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>

              <input
                {...register('name', {
                  required: 'Name required'
                })}
                className="w-full px-3 py-2 border rounded"
              />

              {errors.name && (
                <p className="text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>

              <input
                {...register('email', {
                  required: 'Email required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email'
                  }
                })}
                className="w-full px-3 py-2 border rounded"
              />

              {errors.email && (
                <p className="text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

              <input
                type="password"
                {...register('password', {
                  required: 'Password required',
                  minLength: {
                    value: 8,
                    message: 'Minimum 8 characters'
                  }
                })}
                className="w-full px-3 py-2 border rounded"
              />

              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Register as Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}