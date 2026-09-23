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
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#F5C2BF] text-[#C2413B] hover:bg-[#FCE9E7] transition-colors cursor-pointer"
      >
        Report Issue / Release
      </button>
    );
  }

  return (
    <div className="w-full border border-[#F5C2BF] bg-[#FCE9E7]/40 rounded-xl p-3.5 mt-2 space-y-2.5">
      <p className="text-xs font-semibold text-[#C2413B]">Release task back to cooperative pool</p>
      <textarea
        rows={2}
        placeholder="Briefly state reason (e.g. equipment failure, access blocked, urgent emergency)..."
        className="w-full text-xs px-3 py-2 bg-white border border-[#F5C2BF] rounded-lg outline-none focus:ring-2 focus:ring-[#C2413B]/20 text-[#101010]"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={submitting}
          className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-[#C2413B] text-white hover:bg-[#a8332d] disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {submitting ? 'Releasing...' : 'Confirm Release'}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-[#E8E5DE] bg-white text-[#596174] hover:bg-[#FAF9F6] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}