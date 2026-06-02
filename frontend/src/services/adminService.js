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

export const createDrive = async (payload) => {
  const response = await api.post('/api/admin/drives', payload);
  return response.data;
};

export const updateDrive = async (driveId, payload) => {
  const response = await api.put(
    `/api/admin/drives/${driveId}`,
    payload
  );
  return response.data;
};

export const deleteDrive = async (driveId) => {
  const response = await api.delete(
    `/api/admin/drives/${driveId}`
  );
  return response.data;
};

export const updateCompanyStatus = async (companyId, status) => {
  const response = await api.put(`/api/admin/companies/${companyId}/status`, { status });
  return response.data;
};

export const updateStudent = async (studentId, payload) => {
  const response = await api.put(`/api/admin/students/${studentId}`, payload);
  return response.data;
};

export const deleteStudent = async (studentId) => {
  const response = await api.delete(`/api/admin/students/${studentId}`);
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/api/admin/interviews');
  return response.data;
};

export const getPlacements = async () => {
  const response = await api.get('/api/admin/placements');
  return response.data;
};