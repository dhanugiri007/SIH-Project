import api from '../../../shared/utils/api';

export const ratingService = {
  submit: (taskId, stars, comment) =>
    api.post(`/ratings/task/${taskId}`, { stars, comment }).then((r) => r.data.data),
  getForTask: (taskId) => api.get(`/ratings/task/${taskId}`).then((r) => r.data.data).catch(() => null),
};