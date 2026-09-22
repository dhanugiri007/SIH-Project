import { useEffect, useState } from 'react';
import { jobRequestService } from '../service/jobRequestService';

export function useMyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobRequestService
      .listJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading };
}