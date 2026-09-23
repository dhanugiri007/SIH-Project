import TaskTypeBadge from './TaskTypeBadge';
import StatusBadge from './StatusBadge';

export default function JobGraphPreview({ job }) {
  if (!job) return null;

  const taskById = Object.fromEntries(job.tasks.map((t) => [t._id, t]));

  return (
    <div className="border border-[#E8E5DE] rounded-2xl p-6 bg-white shadow-sahyog-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#0A0A0D]">{job.title}</h3>
          <p className="text-xs text-[#596174]">Automated Task Graph Decomposition</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="space-y-3">
        {job.tasks.map((task, idx) => (
          <div key={task._id} className="border border-[#E8E5DE] rounded-xl p-3.5 hover:border-[#D5A63A] transition-colors bg-[#FAF9F6]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#B8861B] bg-[#FFF9E8] px-2 py-0.5 rounded border border-[#EED58C]">
                  Step {idx + 1}
                </span>
                <span className="font-bold text-xs text-[#0A0A0D]">{task.title}</span>
              </div>
              <TaskTypeBadge type={task.type} />
            </div>
            {task.description && <p className="text-xs text-[#596174] mb-2 leading-relaxed">{task.description}</p>}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A909F]">
              <span>⏱ {task.estimatedDurationMinutes} min</span>
              {task.requiredSkills?.length > 0 && <span>🛠 {task.requiredSkills.join(', ')}</span>}
              {task.dependsOn?.length > 0 && (
                <span className="text-[#80540B] font-medium bg-[#FFF9E8] px-2 py-0.5 rounded border border-[#EED58C]">
                  ⛓ Depends on: {task.dependsOn.map((d) => taskById[d._id]?.title || d.title).join(', ')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}