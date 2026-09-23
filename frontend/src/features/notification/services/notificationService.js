import api from '../../../shared/utils/api';

export const notificationApiService = {
  list: () => api.get('/notifications').then((r) => r.data.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data.data),
  markAllRead: () => api.patch('/notifications/read-all'),
};