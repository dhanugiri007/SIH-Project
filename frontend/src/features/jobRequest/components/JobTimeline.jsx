import { useEffect, useState } from 'react';
import { timelineService } from '../service/timelineService';

const EVENT_LABELS = {
  status_changed: (e) => `${e.task?.title || 'Task'}: ${e.fromStatus?.replace('_', ' ') || '—'} → ${e.toStatus?.replace('_', ' ')}`,
  reopened: (e) => `${e.task?.title || 'Task'} reopened: ${e.note}`,
  proof_uploaded: (e) => `${e.task?.title || 'Task'}: completion proof uploaded`,
};

export default function JobTimeline({ jobId }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    timelineService.getForJob(jobId).then(setEntries).catch(() => {});
  }, [jobId]);

  if (entries.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e._id} className="flex gap-3 text-sm">
            <span className="text-xs text-gray-400 w-16 shrink-0">
              {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div>
              <p className="text-gray-700">{EVENT_LABELS[e.event]?.(e) || e.event}</p>
              <p className="text-xs text-gray-400">{e.actor?.name || 'System'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}