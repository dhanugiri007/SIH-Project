import TaskTypeBadge from './TaskTypeBadge';
import StatusBadge from './StatusBadge';

const canVerify = (task) => task.status === 'completed';
const canCancel = (task) => ['pending', 'offered', 'assigned'].includes(task.status);
const isBlocked = (task) =>
  task.status === 'pending' &&
  task.dependsOn?.some((d) => !['completed', 'verified'].includes(d.status));

export default function TaskCard({ task, onVerify, onCancel }) {
  const blocked = isBlocked(task);

  return (
    <div className={`border rounded-lg p-3 transition-colors ${blocked ? 'border-amber-200 bg-amber-50/40' : 'border-gray-100 hover:border-indigo-200'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{task.title}</span>
          <TaskTypeBadge type={task.type} />
        </div>
        <StatusBadge status={task.status} />
      </div>

      {task.description && <p className="text-sm text-gray-500 mb-2">{task.description}</p>}

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
        <span>⏱ {task.estimatedDurationMinutes} min</span>
        {task.assignedWorker && <span>👷 {task.assignedWorker.name}</span>}
        {blocked && (
          <span className="text-amber-600 font-medium">
            🔒 waiting on: {task.dependsOn.filter((d) => !['completed', 'verified'].includes(d.status)).map((d) => d.title).join(', ')}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {canVerify(task) && (
          <button
            onClick={() => onVerify(task._id)}
            className="text-xs px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Mark Verified
          </button>
        )}
        {canCancel(task) && (
          <button
            onClick={() => onCancel(task._id)}
            className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
          >
            Cancel Task
          </button>
        )}
      </div>
    </div>
  );
}