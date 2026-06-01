import api from './api';

export const getSummary = async () => {
  const response = await api.get('/api/admin/reports/summary');
  return response.data;
};

export const getStudents = async (params = {}) => {
  const response = await api.get('/api/admin/students', { params });
  return response.data;
};

export const getCompanies = async (params = {}) => {
  const response = await api.get('/api/admin/companies', { params });
  return response.data;
};

export const getDrives = async () => {
  const response = await api.get('/api/admin/drives');
  return response.data;
};