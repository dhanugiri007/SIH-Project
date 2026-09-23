import { useEffect, useState } from 'react';
import StatusBadge from '../../jobRequest/components/StatusBadge';
import TaskTypeBadge from '../../jobRequest/components/TaskTypeBadge';
import ExplanationPanel from './ExplainationPanel';
import ReportIssueButton from './ReportIssueButton';
import CompletionProofCapture from './CompletionProofCapture';
import { completionProofService } from '../service/completionProofService';

const isBlocked = (task) =>
  task.status === 'assigned' && task.dependsOn?.some((d) => !['completed', 'verified'].includes(d.status));

export default function WorkerTaskCard({ task, onStart, onComplete, onReportIssue }) {
  const [showWhy, setShowWhy] = useState(false);
  const [proof, setProof] = useState(null);
  const [checkedProof, setCheckedProof] = useState(false);
  const blocked = isBlocked(task);

  useEffect(() => {
    if (task.status === 'in_progress') {
      completionProofService.getForTask(task._id).then((p) => {
        setProof(p);
        setCheckedProof(true);
      });
    } else {
      setCheckedProof(true);
    }
  }, [task._id, task.status]);

  return (
    <div
      className={`border rounded-2xl p-5 transition-all duration-150 bg-white ${
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

      <p className="text-xs font-semibold text-[#596174] mb-1">{task.job?.title}</p>
      <p className="text-xs text-[#8A909F] mb-1.5 flex items-center gap-1.5">
        <span>📍</span>
        <span>{task.job?.serviceAddress || 'Customer service address on record'}</span>
      </p>
      {task.job?.customer && (
        <p className="text-xs text-[#596174] mb-2.5 flex items-center gap-1.5 font-medium">
          <span>👤</span>
          <span>{task.job.customer.name} • {task.job.customer.phone}</span>
        </p>
      )}

      {blocked && (
        <p className="text-xs text-[#80540B] font-semibold mb-2.5 bg-[#FFF9E8] px-2.5 py-1 rounded-lg border border-[#EED58C]">
          🔒 Waiting on prerequisite task: {task.dependsOn.filter((d) => !['completed', 'verified'].includes(d.status)).map((d) => d.title).join(', ')}
        </p>
      )}

      <div className="mb-2">
        <button
          onClick={() => setShowWhy((s) => !s)}
          className="text-xs text-[#B8861B] hover:text-[#A57412] font-semibold underline underline-offset-2 cursor-pointer"
        >
          {showWhy ? 'Hide allocation explanation' : 'Why was I matched to this task?'}
        </button>
      </div>

      {showWhy && <ExplanationPanel explanation={task.dispatchExplanation} />}

      {task.status === 'in_progress' && checkedProof && !proof && (
        <CompletionProofCapture taskId={task._id} onUploaded={setProof} />
      )}
      {task.status === 'in_progress' && proof && (
        <div className="p-2.5 rounded-xl bg-[#E8F8EF] border border-[#A7E8C2] text-xs text-[#16834B] font-semibold mt-2.5 flex items-center gap-1.5">
          <span>✓</span>
          <span>Proof recorded — ready to complete task</span>
        </div>
      )}

      <div className="flex gap-2.5 mt-4 flex-wrap">
        {task.status === 'assigned' && !blocked && (
          <button
            onClick={() => onStart(task._id)}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#B8861B] hover:bg-[#A57412] text-white shadow-sm transition-colors cursor-pointer"
          >
            Start Work & Broadcast Location
          </button>
        )}
        {task.status === 'in_progress' && proof && (
          <button
            onClick={() => onComplete(task._id)}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#16834B] hover:bg-[#11693c] text-white shadow-sm transition-colors cursor-pointer"
          >
            Mark Task Complete
          </button>
        )}
        {['assigned', 'in_progress'].includes(task.status) && (
          <ReportIssueButton taskId={task._id} onReport={onReportIssue} />
        )}
      </div>
    </div>
  );
}