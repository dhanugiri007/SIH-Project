import { useEffect, useRef } from 'react';
import { workerTaskService } from '../service/workerTaskService';

const PING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes — persisted snapshot for dispatch proximity scoring

// Distinct from Flow 7's real-time watchPosition broadcast (which is only active
// during an in_progress task and goes over sockets). This is a lower-frequency
// background ping, persisted to Mongo, that keeps a worker's base location fresh
// for dispatch eligibility scoring whenever they're online — active task or not.
export function useLocationPing(isOnline) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOnline || !navigator.geolocation) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const ping = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          workerTaskService.pingLocation(pos.coords.latitude, pos.coords.longitude).catch(() => {});
        },
        () => {},
        { enableHighAccuracy: false, timeout: 8000 }
      );
    };

    ping(); // immediate first ping on going online
    intervalRef.current = setInterval(ping, PING_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [isOnline]);
}