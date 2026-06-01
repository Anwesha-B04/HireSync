import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Student Registration</h2>

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
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input {...register('name', { required: 'Name required' })} className="w-full px-3 py-2 border rounded" />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Roll Number</label>
              <input {...register('rollNo', { required: 'Roll number required' })} className="w-full px-3 py-2 border rounded" />
              {errors.rollNo && <p className="text-sm text-red-600">{errors.rollNo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input {...register('department', { required: 'Department required' })} className="w-full px-3 py-2 border rounded" />
              {errors.department && <p className="text-sm text-red-600">{errors.department.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <input {...register('course', { required: 'Course required' })} className="w-full px-3 py-2 border rounded" />
              {errors.course && <p className="text-sm text-red-600">{errors.course.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CGPA</label>
              <input type="number" step="0.01" {...register('cgpa', { required: 'CGPA required', min: { value: 0, message: 'Minimum 0' }, max: { value: 10, message: 'Maximum 10' } })} className="w-full px-3 py-2 border rounded" />
              {errors.cgpa && <p className="text-sm text-red-600">{errors.cgpa.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Passing Year</label>
              <input type="number" {...register('passingYear', { required: 'Passing year required', min: { value: 2000, message: 'Invalid year' }, max: { value: 2100, message: 'Invalid year' } })} className="w-full px-3 py-2 border rounded" />
              {errors.passingYear && <p className="text-sm text-red-600">{errors.passingYear.message}</p>}
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register as Student</button>
          </div>
        </form>
      </div>
    </div>
  );
}
