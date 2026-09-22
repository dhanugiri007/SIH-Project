import { useEffect, useRef } from 'react';

// Free, browser-native watchPosition — pushes the worker's live location over the
// already-open WorkCell socket room whenever they have an in-progress task there.
export function useLocationBroadcast(socket, connected, workCellId, active) {
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!active || !connected || !workCellId || !socket.current) return;
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        socket.current.emit('location:update', {
          workCellId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {}, // fail silently — location sharing is best-effort
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [active, connected, workCellId, socket]);
}