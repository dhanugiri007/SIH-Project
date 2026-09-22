import api from '../../../shared/utils/api';

export const payoutService = {
  getMine: () => api.get('/settlements/mine').then((r) => r.data.data),
};