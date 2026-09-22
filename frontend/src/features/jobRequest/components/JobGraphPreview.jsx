import TaskTypeBadge from './TaskTypeBadge';

export default function JobGraphPreview({ job }) {
  if (!job) return null;

  const taskById = Object.fromEntries(job.tasks.map((t) => [t._id, t]));

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 capitalize">
          {job.status}
        </span>
      </div>

      <div className="space-y-3">
        {job.tasks.map((task, idx) => (
          <div key={task._id} className="border border-gray-100 rounded-lg p-3 hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">#{idx + 1}</span>
                <span className="font-medium text-gray-900">{task.title}</span>
              </div>
              <TaskTypeBadge type={task.type} />
            </div>
            {task.description && <p className="text-sm text-gray-500 mb-2">{task.description}</p>}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <span>⏱ {task.estimatedDurationMinutes} min</span>
              {task.requiredSkills?.length > 0 && (
                <span>🛠 {task.requiredSkills.join(', ')}</span>
              )}
              {task.dependsOn?.length > 0 && (
                <span className="text-amber-600">
                  ⛓ depends on: {task.dependsOn.map((d) => taskById[d._id]?.title || d.title).join(', ')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}