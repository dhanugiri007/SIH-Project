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
    <div className="border border-[#E8E5DE] rounded-2xl p-6 bg-white shadow-sahyog-card mt-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-[#0A0A0D]">Execution Timeline</h3>
        <span className="text-[11px] font-semibold text-[#80540B] bg-[#FFF9E8] px-2.5 py-0.5 rounded-full border border-[#EED58C]">
          Audit Trail
        </span>
      </div>

      <div className="relative pl-6 space-y-4 border-l border-[#E8E5DE] ml-2">
        {entries.map((e) => (
          <div key={e._id} className="relative group">
            {/* Timeline node */}
            <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-[#B8861B] border-2 border-white ring-2 ring-[#EED58C]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#101010]">
                  {EVENT_LABELS[e.event]?.(e) || e.event}
                </span>
                <span className="text-[10px] text-[#8A909F]">
                  {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] text-[#596174] mt-0.5">
                Actor: <span className="font-medium text-[#101010]">{e.actor?.name || 'System Dispatcher'}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}