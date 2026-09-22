import api from '../../../shared/utils/api';

export const completionProofService = {
  upload: (taskId, file, note) => {
    const formData = new FormData();
    formData.append('file', file);
    if (note) formData.append('note', note);
    return api.post(`/completion-proofs/task/${taskId}`, formData).then((r) => r.data.data);
  },
  getForTask: (taskId) =>
    api.get(`/completion-proofs/task/${taskId}`).then((r) => r.data.data).catch(() => null),
};