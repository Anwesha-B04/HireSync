import api from './api';

const LOGIN_URL = '/api/auth/login';

export const login = async (email, password) => {
  const res = await api.post(LOGIN_URL, { email, password });
  return res.data;
};

export const registerStudent = async (payload) => {
  const res = await api.post('/api/auth/register/student', payload);
  return res.data;
};

export const registerCompany = async (payload) => {
  const res = await api.post('/api/auth/register/company', payload);
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/api/auth/logout');
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post('/api/auth/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (email, token, newPassword) => {
  const res = await api.post('/api/auth/reset-password', { email, token, newPassword });
  return res.data;
};
