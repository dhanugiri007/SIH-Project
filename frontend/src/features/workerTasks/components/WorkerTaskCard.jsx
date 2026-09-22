import { useState } from 'react';
import StatusBadge from '../../jobRequest/components/StatusBadge';
import TaskTypeBadge from '../../jobRequest/components/TaskTypeBadge';
import ExplanationPanel from  './ExplainationPanel';
import ReportIssueButton from './ReportIssueButton';

const isBlocked = (task) =>
  task.status === 'assigned' && task.dependsOn?.some((d) => !['completed', 'verified'].includes(d.status));

export default function WorkerTaskCard({ task, onStart, onComplete, onReportIssue }) {
  const [showWhy, setShowWhy] = useState(false);
  const blocked = isBlocked(task);

  return (
    <div className={`border rounded-lg p-4 ${blocked ? 'border-amber-200 bg-amber-50/40' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{task.title}</span>
          <TaskTypeBadge type={task.type} />
        </div>
        <StatusBadge status={task.status} />
      </div>

      <p className="text-sm text-gray-500 mb-1">{task.job?.title}</p>
      <p className="text-xs text-gray-400 mb-2">📍 {task.job?.serviceAddress || 'Address not provided'}</p>
      {task.job?.customer && (
        <p className="text-xs text-gray-400 mb-2">👤 {task.job.customer.name} · {task.job.customer.phone}</p>
      )}

      {blocked && (
        <p className="text-xs text-amber-600 font-medium mb-2">
          🔒 Waiting on: {task.dependsOn.filter((d) => !['completed', 'verified'].includes(d.status)).map((d) => d.title).join(', ')}
        </p>
      )}

      <button onClick={() => setShowWhy((s) => !s)} className="text-xs text-indigo-500 underline underline-offset-2 mb-2">
        why was I picked?
      </button>
      {showWhy && <ExplanationPanel explanation={task.dispatchExplanation} />}

      <div className="flex gap-2 mt-2 flex-wrap">
        {task.status === 'assigned' && !blocked && (
          <button onClick={() => onStart(task._id)} className="text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
            Start Task
          </button>
        )}
        {task.status === 'in_progress' && (
          <button onClick={() => onComplete(task._id)} className="text-xs px-3 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
            Mark Complete
          </button>
        )}
        {['assigned', 'in_progress'].includes(task.status) && (
          <ReportIssueButton taskId={task._id} onReport={onReportIssue} />
        )}
      </div>
    </div>
  );
}