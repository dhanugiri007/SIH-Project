import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../../../shared/hooks/useSocket';
import { workCellApiService } from '../service/workCellApiService';

export function useWorkCell(jobId) {
  const { socket, connected } = useSocket();
  const [workCell, setWorkCell] = useState(null);
  const [presentUserIds, setPresentUserIds] = useState([]);
  const [liveLocations, setLiveLocations] = useState({}); // workerId -> { lat, lng }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const data = await workCellApiService.getByJob(jobId);
      setWorkCell(data);
      setError('');
    } catch (err) {
      setError(err.message || 'No live crew for this job yet');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!connected || !workCell?._id || !socket.current) return;
    const s = socket.current;

    s.emit('workcell:join', { workCellId: workCell._id });

    const handleTaskUpdated = () => refresh();
    const handlePresence = ({ presentUserIds }) => setPresentUserIds(presentUserIds);
    const handleCompleted = () => refresh();
    const handleLocation = ({ workerId, lat, lng }) =>
      setLiveLocations((prev) => ({ ...prev, [workerId]: { lat, lng } }));
    const handleReopened = () => refresh();

    s.on('task:updated', handleTaskUpdated);
    s.on('workcell:presence', handlePresence);
    s.on('workcell:completed', handleCompleted);
    s.on('workcell:updated', handleTaskUpdated);
    s.on('worker:location', handleLocation);
    s.on('task:reopened', handleReopened);

    return () => {
      s.emit('workcell:leave', { workCellId: workCell._id });
      s.off('task:updated', handleTaskUpdated);
      s.off('workcell:presence', handlePresence);
      s.off('workcell:completed', handleCompleted);
      s.off('workcell:updated', handleTaskUpdated);
      s.off('worker:location', handleLocation);
      s.off('task:reopened', handleReopened);
    };
  }, [connected, workCell?._id, socket, refresh]);

  return { workCell, presentUserIds, liveLocations, loading, error, refresh };
}