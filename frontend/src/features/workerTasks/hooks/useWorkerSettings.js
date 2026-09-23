import { useEffect, useState } from 'react';
import { workerTaskService } from '../service/workerTaskService';

export function useWorkerSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const refresh = async () => {
    const data = await workerTaskService.getMyProfile();
    setProfile(data);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const saveSkillsAndCapacity = async (skills, capacity) => {
    setSaving(true);
    try {
      await workerTaskService.updateSkillsAndCapacity(skills, capacity);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const saveAvailabilityWindows = async (windows) => {
    setSaving(true);
    try {
      await workerTaskService.updateAvailabilityWindows(windows);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const addCertification = async (payload) => {
    setSaving(true);
    try {
      await workerTaskService.addCertification(payload);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  // Manual, one-shot location capture — more reliable for a demo than waiting
  // on the background ping, since it resolves (or fails) immediately and visibly.
  const captureLocationNow = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported in this browser');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await workerTaskService.pingLocation(pos.coords.latitude, pos.coords.longitude);
          await refresh();
        } catch (err) {
          setLocationError(err.message || 'Failed to save location');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocationError(err.message || 'Could not get your location — check browser permissions');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return {
    profile, loading, saving, locating, locationError,
    saveSkillsAndCapacity, saveAvailabilityWindows, addCertification, captureLocationNow,
  };
}