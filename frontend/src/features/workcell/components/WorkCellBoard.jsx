import PresenceDot from './PresenceDot';
import StatusBadge from '../../jobRequest/components/StatusBadge';
import WorkerLocationMap from './WorkerLocationMap';

export default function WorkCellBoard({ workCell, presentUserIds, liveLocations = {} }) {
  if (!workCell) return null;
  const activeMembers = workCell.members.filter((m) => m.status === 'active');

  return (
    <div className="border border-[#E8E5DE] rounded-2xl p-6 bg-white shadow-sahyog-card mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#0A0A0D]">Cooperative WorkCell Crew</h3>
          <p className="text-xs text-[#596174]">Live coordination & real-time telemetry for multi-worker tasks</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF9E8] border border-[#EED58C] text-[#80540B] capitalize flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8861B] animate-pulse" />
          {workCell.status}
        </span>
      </div>

      <div className="space-y-3">
        {activeMembers.map((member) => {
          const isOnline = presentUserIds.includes(String(member.worker._id));
          const loc = liveLocations[String(member.worker._id)];
          return (
            <div key={member.task._id} className="border border-[#E8E5DE] rounded-xl p-3.5 bg-[#FAF9F6]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <PresenceDot online={isOnline} />
                  <div>
                    <p className="font-bold text-xs text-[#0A0A0D]">{member.worker.name}</p>
                    <p className="text-[11px] text-[#596174]">{member.task.title}</p>
                  </div>
                </div>
                <StatusBadge status={member.task.status} />
              </div>
              {member.task.status === 'in_progress' && loc && (
                <div className="mt-2 pt-2 border-t border-[#E8E5DE]">
                  <WorkerLocationMap lat={loc.lat} lng={loc.lng} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}