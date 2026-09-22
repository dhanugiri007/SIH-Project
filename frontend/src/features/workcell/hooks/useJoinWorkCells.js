import { useEffect } from 'react';
import { useSocket } from '../../../shared/hooks/useSocket';
import { workCellApiService } from '../service/workCellApiService';

// Workers auto-join every WorkCell room tied to their current jobs, so the customer's
// presence indicator shows them as online for that crew.
export function useJoinWorkCells(jobIds) {
  const { socket, connected } = useSocket();
  const jobIdsKey = jobIds.join(',');

  useEffect(() => {
    if (!connected || !socket.current || jobIds.length === 0) return;
    const s = socket.current;
    const workCellIds = [];

    (async () => {
      for (const jobId of jobIds) {
        try {
          const wc = await workCellApiService.getByJob(jobId);
          if (wc?._id) {
            workCellIds.push(wc._id);
            s.emit('workcell:join', { workCellId: wc._id });
          }
        } catch {
          // job may not have a WorkCell yet — skip silently
        }
      }
    })();

    return () => {
      workCellIds.forEach((id) => s.emit('workcell:leave', { workCellId: id }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, jobIdsKey]);
}