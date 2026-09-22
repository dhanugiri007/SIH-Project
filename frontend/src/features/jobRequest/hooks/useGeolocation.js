import { useState } from 'react';


export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('idle'); // idle | locating | resolving | done | error
  const [error, setError] = useState('');

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { Accept: 'application/json' } }
      );
      if (!res.ok) throw new Error('Reverse geocoding failed');
      const data = await res.json();
      return data.display_name || '';
    } catch (err) {
      return ''; // fail silently — coords are still captured/usable even if this fails
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported in this browser');
      return;
    }
    setStatus('locating');
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { longitude, latitude } = pos.coords;
        setCoords({ lng: longitude, lat: latitude });

        setStatus('resolving');
        const resolvedAddress = await reverseGeocode(latitude, longitude);
        setAddress(resolvedAddress);
        setStatus('done');
      },
      (err) => {
        setStatus('error');
        setError(err.message || 'Could not get your location');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return { coords, address, status, error, locate };
}