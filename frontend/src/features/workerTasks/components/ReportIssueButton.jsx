import { useState } from 'react';

export default function ReportIssueButton({ taskId, onReport }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await onReport(taskId, reason || 'Unable to complete this task');
      setOpen(false);
      setReason('');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50">
        Can't do this task
      </button>
    );
  }

  return (
    <div className="border border-red-200 bg-red-50/40 rounded-lg p-3 mt-2 space-y-2">
      <textarea
        rows={2}
        placeholder="Briefly tell us why (e.g. vehicle broke down, wrong tools)"
        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-red-400"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={submit} disabled={submitting} className="text-xs px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
          {submitting ? 'Reporting...' : 'Confirm — release this task'}
        </button>
        <button onClick={() => setOpen(false)} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
}