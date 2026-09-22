import api from '../../../shared/utils/api';

export const workerTaskService = {
  getMyTasks: () => api.get('/tasks/mine').then((r) => r.data.data),
  updateTaskStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }).then((r) => r.data.data),
  updateAvailability: (isOnline) =>
    api.patch('/workers/me/profile', { availability: { isOnline } }).then((r) => r.data.data),
  getMyProfile: () => api.get('/workers/me/profile').then((r) => r.data.data),
};