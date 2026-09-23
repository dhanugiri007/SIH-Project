import { useCallback, useEffect, useState } from 'react';
import { adminService } from '../service/adminService';

export function useAdminData() {
  const [workers, setWorkers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [w, j, a] = await Promise.all([
      adminService.listWorkers(),
      adminService.listJobs(),
      adminService.getAnalytics(),
    ]);
    setWorkers(w);
    setJobs(j);
    setAnalytics(a);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const updateCapacity = async (id, capacity) => {
    await adminService.updateCapacity(id, capacity);
    await refresh();
  };

  const toggleActive = async (id, isActive) => {
    await adminService.toggleActive(id, isActive);
    await refresh();
  };

  const verifyCertification = async (id, certIndex) => {
    await adminService.verifyCertification(id, certIndex);
    await refresh();
  };

  return { workers, jobs, analytics, loading, updateCapacity, toggleActive, verifyCertification, refresh };
}