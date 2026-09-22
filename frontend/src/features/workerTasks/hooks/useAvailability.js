import { useEffect, useState } from 'react';
import { workerTaskService } from '../service/workerTaskService';

export function useAvailability() {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workerTaskService
      .getMyProfile()
      .then((p) => setIsOnline(p.availability?.isOnline || false))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async () => {
    const next = !isOnline;
    setIsOnline(next); // optimistic
    await workerTaskService.updateAvailability(next);
  };

  return { isOnline, loading, toggle };
}