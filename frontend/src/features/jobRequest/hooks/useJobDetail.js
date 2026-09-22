import { useCallback, useEffect, useState } from 'react';
import { jobRequestService } from '../service/jobRequestService';

export function useJobDetail(jobId) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const data = await jobRequestService.getJob(jobId);
      setJob(data);
    } catch (err) {
      setError(err.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const verifyTask = async (taskId) => {
    await jobRequestService.updateTaskStatus(taskId, 'verified');
    await refresh();
  };

  const cancelTask = async (taskId) => {
    await jobRequestService.updateTaskStatus(taskId, 'cancelled');
    await refresh();
  };

  return { job, loading, error, refresh, verifyTask, cancelTask };
}