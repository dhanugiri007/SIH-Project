import { useEffect, useState } from 'react';
import TaskTypeBadge from './TaskTypeBadge';
import StatusBadge from './StatusBadge';
import RatingBox from './RatingBox';
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
    <div
      className={`border rounded-2xl p-4 md:p-5 transition-all duration-150 bg-white ${
        blocked
          ? 'border-[#EED58C] bg-[#FFF9E8]/30'
          : 'border-[#E8E5DE] hover:border-[#D5A63A] shadow-sahyog-card'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-bold text-sm text-[#0A0A0D]">{task.title}</span>
          <TaskTypeBadge type={task.type} />
        </div>
        <StatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="text-xs text-[#596174] mb-3 leading-relaxed">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-[#596174] mb-3">
        <span className="inline-flex items-center gap-1 font-medium">
          ⏱ {task.estimatedDurationMinutes} min
        </span>
        {task.assignedWorker && (
          <span className="inline-flex items-center gap-1 font-medium text-[#101010]">
            👷 {task.assignedWorker.name}
          </span>
        )}
        {blocked && (
          <span className="text-[#80540B] font-semibold bg-[#FFF9E8] px-2 py-0.5 rounded-md border border-[#EED58C]">
            🔒 waiting on: {task.dependsOn.filter((d) => !['completed', 'verified'].includes(d.status)).map((d) => d.title).join(', ')}
          </span>
        )}
        {exp && (
          <button
            onClick={() => setShowWhy((s) => !s)}
            className="text-[#B8861B] hover:text-[#A57412] font-semibold underline underline-offset-2 cursor-pointer"
          >
            {showWhy ? 'Hide matching rationale' : 'Why this worker?'}
          </button>
        )}
      </div>

      {/* Transparent Dispatching Explanation Panel */}
      {showWhy && exp && (
        <div className="mb-3 text-xs bg-[#FFF9E8] border border-[#EED58C] rounded-xl p-3 text-[#5C3C08] space-y-1.5">
          <p className="font-medium text-[#80540B]">{exp.reason}</p>
          <div className="flex gap-3 flex-wrap text-xs pt-1 border-t border-[#FBECC5]">
            <span>Skill Match: <strong>{exp.skillMatchScore}</strong></span>
            <span>Proximity: <strong>{exp.proximityScore}{exp.proximityKm != null ? ` (${exp.proximityKm}km)` : ''}</strong></span>
            <span>Coop Fairness: <strong>{exp.fairnessScore}</strong></span>
            <span>Rating: <strong>{exp.ratingScore}</strong></span>
            <span className="text-[#B8861B] font-bold">Total: {exp.totalScore}</span>
          </div>
        </div>
      )}

      {/* Completion Photo/Video Proof */}
      {proof && (
        <div className="mb-3 border border-[#E8E5DE] rounded-xl overflow-hidden bg-[#FAF9F6] p-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#596174] mb-1.5">
            Worker Verification Proof
          </p>
          {proof.fileType === 'video' ? (
            <video src={resolveFileUrl(proof.fileUrl)} controls className="w-full rounded-lg max-h-56 bg-black" />
          ) : (
            <img src={resolveFileUrl(proof.fileUrl)} alt="Completion proof" className="w-full rounded-lg max-h-56 object-cover" />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2.5">
        {canVerify(task) && (
          <button
            onClick={() => onVerify(task._id)}
            className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-[#16834B] hover:bg-[#11693c] text-white shadow-sm transition-colors cursor-pointer"
          >
            Verify Completion
          </button>
        )}
        {canCancel(task) && (
          <button
            onClick={() => onCancel(task._id)}
            className="text-xs font-semibold px-4 py-1.5 rounded-xl border border-[#F5C2BF] text-[#C2413B] hover:bg-[#FCE9E7] transition-colors cursor-pointer"
          >
            Cancel Task
          </button>
        )}
      </div>

      <RatingBox task={task} />
    </div>
  );
}