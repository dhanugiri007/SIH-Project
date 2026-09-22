import { useCallback, useEffect, useState } from 'react';
import { workerTaskService } from '../service/workerTaskService';

export function useMyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await workerTaskService.getMyTasks();
    setTasks(data);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const startTask = async (taskId) => {
    await workerTaskService.updateTaskStatus(taskId, 'in_progress');
    await refresh();
  };

  const completeTask = async (taskId) => {
    await workerTaskService.updateTaskStatus(taskId, 'completed');
    await refresh();
  };

  return { tasks, loading, startTask, completeTask, refresh };
}