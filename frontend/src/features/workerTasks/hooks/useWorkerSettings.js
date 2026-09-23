import { useEffect, useState } from 'react';
import { workerTaskService } from '../service/workerTaskService';

export function useWorkerSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  return { profile, loading, saving, saveSkillsAndCapacity, saveAvailabilityWindows, addCertification };
}