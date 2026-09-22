import PresenceDot from './PresenceDot';
import StatusBadge from '../../jobRequest/components/StatusBadge';

export default function WorkCellBoard({ workCell, presentUserIds }) {
  if (!workCell) return null;

  const activeMembers = workCell.members.filter((m) => m.status === 'active');

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Crew</h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-100 text-violet-700 capitalize">
          {workCell.status}
        </span>
      </div>

      <div className="space-y-3">
        {activeMembers.map((member) => {
          const isOnline = presentUserIds.includes(String(member.worker._id));
          return (
            <div key={member.task._id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <PresenceDot online={isOnline} />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{member.worker.name}</p>
                  <p className="text-xs text-gray-400">{member.task.title}</p>
                </div>
              </div>
              <StatusBadge status={member.task.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}