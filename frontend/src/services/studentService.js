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

export const uploadResume = async (formData) => {
  const response = await api.post(
    '/api/students/resume',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};

export const addSkill = async (skillName) => {
  const response = await api.post(
    '/api/students/skills',
    { skillName }
  );

  return response.data;
};

export const removeSkill = async (skillId) => {
  const response = await api.delete(
    `/api/students/skills/${skillId}`
  );

  return response.data;
};
