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

export const shortlistStudent = async (applicationId, status) => {
  const response = await api.post(`/api/companies/applications/${applicationId}/shortlist`, { status });
  return response.data;
};

export const scheduleInterview = async (applicationId, roundName, interviewDate) => {
  const response = await api.post('/api/companies/interviews', { applicationId, roundName, interviewDate });
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/api/companies/interviews');
  return response.data;
};

export const updateInterviewResult = async (interviewId, result) => {
  const response = await api.put(`/api/companies/interviews/${interviewId}/result`, { result });
  return response.data;
};
