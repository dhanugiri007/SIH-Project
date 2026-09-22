import api from '../../../shared/utils/api';

export const jobRequestService = {
  createJob: (payload) => api.post('/jobs', payload).then((r) => r.data.data),
  listJobs: () => api.get('/jobs').then((r) => r.data.data),
  getJob: (id) => api.get(`/jobs/${id}`).then((r) => r.data.data),
};