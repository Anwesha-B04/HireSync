import api from './api';

export const getProfile = async () => {
  const response = await api.get('/api/students/profile');
  return response.data;
};

export const getApplications = async () => {
  const response = await api.get('/api/students/applications');
  return response.data;
};

export const getJobs = async () => {
  const response = await api.get('/api/students/jobs');
  return response.data;
};

export const applyToJob = async (jobId) => {
  const response = await api.post(`/api/students/jobs/${jobId}/apply`);
  return response.data;
};

export const getDashboardData = async () => {
  const [profileResponse, applicationsResponse] = await Promise.all([
    getProfile(),
    getApplications()
  ]);

  return {
    profile: profileResponse.student,
    applications: applicationsResponse.applications || []
  };
};
