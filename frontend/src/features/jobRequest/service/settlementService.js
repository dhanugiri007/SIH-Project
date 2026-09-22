import api from '../../../shared/utils/api';

export const settlementService = {
  getForJob: (jobId) => api.get(`/settlements/job/${jobId}`).then((r) => r.data.data).catch(() => null),
};