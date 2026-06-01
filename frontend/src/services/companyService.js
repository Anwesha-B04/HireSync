import api from './api';

export const getDashboard = async () => {
  const response = await api.get('/api/companies/dashboard');
  return response.data;
};

export const createJob = async (payload) => {
  const response = await api.post('/api/companies/jobs', payload);
  return response.data;
};

export const updateJob = async (jobId, payload) => {
  const response = await api.put(`/api/companies/jobs/${jobId}`, payload);
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/api/companies/jobs/${jobId}`);
  return response.data;
};
