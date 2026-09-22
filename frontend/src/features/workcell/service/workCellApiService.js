import api from '../../../shared/utils/api';

export const workCellApiService = {
  getByJob: (jobId) => api.get(`/workcells/job/${jobId}`).then((r) => r.data.data),
};