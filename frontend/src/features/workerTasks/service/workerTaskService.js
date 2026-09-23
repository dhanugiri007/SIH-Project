import api from '../../../shared/utils/api';

export const workerTaskService = {
  getMyTasks: () => api.get('/tasks/mine').then((r) => r.data.data),
  updateTaskStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }).then((r) => r.data.data),
  updateAvailability: (isOnline) =>
    api.patch('/workers/me/profile', { availability: { isOnline } }).then((r) => r.data.data),
  updateAvailabilityWindows: (windows) =>
    api.patch('/workers/me/profile', { availability: { windows } }).then((r) => r.data.data),
  updateSkillsAndCapacity: (skills, capacity) =>
    api.patch('/workers/me/profile', { skills, capacity }).then((r) => r.data.data),
  getMyProfile: () => api.get('/workers/me/profile').then((r) => r.data.data),
  reportFailure: (taskId, reason) =>
    api.post(`/tasks/${taskId}/report-failure`, { reason }).then((r) => r.data.data),
  pingLocation: (lat, lng) => api.patch('/workers/me/location', { lat, lng }).then((r) => r.data.data),
  addCertification: (payload) => api.post('/workers/me/certifications', payload).then((r) => r.data.data),
};