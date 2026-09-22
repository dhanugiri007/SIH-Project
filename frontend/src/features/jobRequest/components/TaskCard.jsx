import { useEffect, useState } from 'react';
import TaskTypeBadge from './TaskTypeBadge';
import StatusBadge from './StatusBadge';
import { resolveFileUrl } from '../../../shared/utils/fileUrl';
import api from '../../../shared/utils/api';

const canVerify = (task) => task.status === 'completed';
const canCancel = (task) => ['pending', 'offered', 'assigned'].includes(task.status);
const isBlocked = (task) =>
  task.status === 'pending' && task.dependsOn?.some((d) => !['completed', 'verified'].includes(d.status));

export default function TaskCard({ task, onVerify, onCancel }) {
  const [showWhy, setShowWhy] = useState(false);
  const [proof, setProof] = useState(null);
  const blocked = isBlocked(task);
  const exp = task.dispatchExplanation;

  useEffect(() => {
    if (['completed', 'verified'].includes(task.status)) {
      api.get(`/completion-proofs/task/${task._id}`).then((r) => setProof(r.data.data)).catch(() => {});
    }
  }, [task._id, task.status]);

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
        {exp && (
          <button onClick={() => setShowWhy((s) => !s)} className="text-indigo-500 underline underline-offset-2">
            why this worker?
          </button>
        )}
      </div>

      {showWhy && exp && (
        <div className="mb-2 text-xs bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-indigo-800 space-y-1">
          <p>{exp.reason}</p>
          <div className="flex gap-3 flex-wrap text-indigo-600">
            <span>Skill: {exp.skillMatchScore}</span>
            <span>Proximity: {exp.proximityScore}{exp.proximityKm != null ? ` (${exp.proximityKm}km)` : ''}</span>
            <span>Fairness: {exp.fairnessScore}</span>
            <span>Rating: {exp.ratingScore}</span>
            <span className="font-semibold">Total: {exp.totalScore}</span>
          </div>
        </div>
      )}

      {proof && (
        <div className="mb-2">
          {proof.fileType === 'video' ? (
            <video src={resolveFileUrl(proof.fileUrl)} controls className="w-full rounded-lg max-h-56" />
          ) : (
            <img src={resolveFileUrl(proof.fileUrl)} alt="Completion proof" className="w-full rounded-lg max-h-56 object-cover" />
          )}
        </div>
      )}

      <div className="flex gap-2">
        {canVerify(task) && (
          <button onClick={() => onVerify(task._id)} className="text-xs px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
            Mark Verified
          </button>
        )}
        {canCancel(task) && (
          <button onClick={() => onCancel(task._id)} className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50">
            Cancel Task
          </button>
        )}
      </div>
    </div>
  );
}