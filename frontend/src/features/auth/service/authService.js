import api from '../../../shared/utils/api';

export const authService = {
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data.data),
  getMe: () => api.get('/auth/me').then((r) => r.data.data),
  listCooperatives: () => api.get('/cooperatives').then((r) => r.data.data),
  registerCooperative: (payload) =>
    api.post('/cooperatives/register', payload).then((r) => r.data.data),
};