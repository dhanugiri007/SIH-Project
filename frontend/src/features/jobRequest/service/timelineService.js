import api from '../../../shared/utils/api';

export const timelineService = {
  getForJob: (jobId) => api.get(`/jobs/${jobId}/timeline`).then((r) => r.data.data),
};