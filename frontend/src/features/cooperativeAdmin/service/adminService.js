import api from '../../../shared/utils/api';

export const adminService = {
  listWorkers: () => api.get('/admin/workers').then((r) => r.data.data),
  getWorker: (id) => api.get(`/admin/workers/${id}`).then((r) => r.data.data),
  updateCapacity: (id, capacity) => api.patch(`/admin/workers/${id}/capacity`, { capacity }).then((r) => r.data.data),
  toggleActive: (id, isActive) => api.patch(`/admin/workers/${id}/active`, { isActive }).then((r) => r.data.data),
  verifyCertification: (id, certIndex) =>
    api.patch(`/admin/workers/${id}/verify-certification`, { certIndex }).then((r) => r.data.data),
  listJobs: () => api.get('/admin/jobs').then((r) => r.data.data),
  getAnalytics: () => api.get('/admin/analytics').then((r) => r.data.data),
};